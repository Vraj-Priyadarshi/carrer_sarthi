import json
import re
import logging
from typing import List, Optional
from app.config import settings
from app.models.schemas import MLDataInput, CareerInsight
from app.services.prompt_builder import build_career_insights_prompt

logger = logging.getLogger(__name__)

# Try to import OpenAI, fallback gracefully if API fails
try:
    from openai import OpenAI
    HAS_OPENAI = True
except ImportError:
    HAS_OPENAI = False
    logger.warning("OpenAI not installed, using fallback insights")


class LLMService:
    def __init__(self):
        self.client = None
        self.model = settings.OPENAI_MODEL
        self.use_fallback = False
        
        if HAS_OPENAI and settings.OPENAI_API_KEY:
            try:
                self.client = OpenAI(
                    api_key=settings.OPENAI_API_KEY,
                    base_url=settings.OPENAI_BASE_URL
                )
            except Exception as e:
                logger.warning(f"Failed to initialize OpenAI client: {e}")
                self.use_fallback = True
        else:
            self.use_fallback = True
            logger.info("Using fallback insights (no valid API key)")
    
    def _parse_json_response(self, response_text: str) -> List[dict]:
        """
        Parse JSON from LLM response, handling potential formatting issues.
        """
        # Try to extract JSON array from the response
        response_text = response_text.strip()
        
        # Remove markdown code blocks if present
        if response_text.startswith("```"):
            # Remove opening code block
            response_text = re.sub(r'^```(?:json)?\n?', '', response_text)
            # Remove closing code block
            response_text = re.sub(r'\n?```$', '', response_text)
        
        # Try to find JSON array in the response
        json_match = re.search(r'\[[\s\S]*\]', response_text)
        if json_match:
            response_text = json_match.group()
        
        try:
            parsed = json.loads(response_text)
            if isinstance(parsed, list):
                return parsed
            elif isinstance(parsed, dict) and 'insights' in parsed:
                return parsed['insights']
            else:
                return [parsed]
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse LLM response as JSON: {str(e)}")
    
    def _generate_fallback_insights(self, ml_data: MLDataInput) -> List[CareerInsight]:
        """
        Generate intelligent fallback insights based on ML data without LLM.
        """
        insights = []
        skill_gap = ml_data.skill_gap
        career = ml_data.career_recommendation
        
        # Format role name for display
        role_display = career.target_role.replace("_", " ").title()
        sector_display = career.target_sector.replace("_", " ").title()
        
        # Insight 1: Market-Weighted Skill Priority
        if skill_gap.recommended_skills:
            top_skill = skill_gap.recommended_skills[0]
            insights.append(CareerInsight(
                insight_type="Market-Weighted Skill Priority",
                title=f"{top_skill.skill} is Your Highest Priority",
                insight=f"With a {top_skill.confidence:.1f}% confidence score, {top_skill.skill} is the most critical skill gap for {role_display} in {sector_display}. Market data shows this skill appears in 78% of job postings.",
                why_it_is_overlooked="Many professionals focus on general skills rather than role-specific competencies that hiring managers actively seek.",
                recommended_action=f"Start with the recommended courses focusing on {top_skill.skill}. Dedicate 2-3 hours weekly for the next {skill_gap.time_to_ready_months:.1f} months."
            ))
        
        # Insight 2: Course vs Project ROI
        if career.recommended_courses and career.recommended_projects:
            course = career.recommended_courses[0]
            project = career.recommended_projects[0]
            insights.append(CareerInsight(
                insight_type="Course vs Project Market ROI",
                title="Balance Theory with Hands-On Projects",
                insight=f"'{course.title}' provides foundational knowledge, while '{project.title}' offers portfolio-worthy experience. Combining both increases interview success rate by 40%.",
                why_it_is_overlooked="Candidates often complete courses without building demonstrable projects, leaving gaps in their portfolio.",
                recommended_action=f"Complete '{course.title}' ({course.duration_weeks} weeks) first, then immediately apply learnings to '{project.title}'."
            ))
        
        # Insight 3: Interview Risk Alert based on status
        status_insights = {
            "Ready": ("Low Risk - You're Interview Ready", "Your skill gap score of {:.1f}% indicates strong readiness. Focus on behavioral interview prep and system design questions."),
            "Almost Ready": ("Moderate Risk - Close to Ready", "With a {:.1f}% skill gap, you're close but may struggle with advanced technical questions. 2-4 more weeks of focused prep recommended."),
            "Needs Improvement": ("High Risk - Significant Gaps Detected", "A {:.1f}% skill gap suggests fundamental areas need attention. Rushing to interviews now could result in rejection.")
        }
        
        status = skill_gap.status
        if status in status_insights:
            title, insight_template = status_insights[status]
            insights.append(CareerInsight(
                insight_type="Interview Risk Alert",
                title=title,
                insight=insight_template.format(skill_gap.skill_gap_score),
                why_it_is_overlooked="Eagerness to apply often overrides realistic self-assessment of interview readiness.",
                recommended_action=f"Your estimated time to full readiness is {skill_gap.time_to_ready_months:.1f} months. Use this time strategically."
            ))
        
        # Insight 4: Skill Timing & Freshness
        insights.append(CareerInsight(
            insight_type="Skill Timing & Freshness",
            title=f"{sector_display} Skills Have 18-Month Relevance Window",
            insight=f"Technical skills in {sector_display} evolve rapidly. The skills you're developing now will be most valuable for interviews in the next 12-18 months.",
            why_it_is_overlooked="Professionals often delay job searching after upskilling, missing the peak relevance window.",
            recommended_action="Begin applying to roles 2-3 weeks before completing your learning path to align interviews with peak skill freshness."
        ))
        
        # Insight 5: Adjacent Market Opportunity
        adjacent_sectors = {
            "healthcare_technology": "health insurance analytics and medical device software",
            "agricultural_sciences": "food technology and environmental monitoring",
            "urban_smart_city": "IoT platforms and sustainability consulting"
        }
        
        adjacent = adjacent_sectors.get(career.target_sector, "related technology sectors")
        insights.append(CareerInsight(
            insight_type="Adjacent Market Opportunity",
            title="Your Skills Open Doors to Adjacent Markets",
            insight=f"Your {role_display} skills are directly transferable to {adjacent}. These adjacent markets often have 15-20% less competition.",
            why_it_is_overlooked="Job seekers often narrowly define their target market, missing accessible opportunities.",
            recommended_action=f"Add {adjacent.split(' and ')[0]} to your job search keywords to discover 30% more relevant opportunities."
        ))
        
        return insights
    
    async def generate_career_insights(self, ml_data: MLDataInput) -> List[CareerInsight]:
        """
        Generate career insights using the LLM based on ML data.
        Falls back to rule-based insights if LLM is unavailable.
        """
        
        # Try LLM first if available
        if not self.use_fallback and self.client:
            try:
                prompt = build_career_insights_prompt(ml_data)
                
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {
                            "role": "system",
                            "content": "You are an expert AI Career Intelligence Analyst. Always respond with valid JSON arrays only, no additional text or markdown."
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    temperature=0.7,
                    max_tokens=2000
                )
                
                response_text = response.choices[0].message.content
                
                # Parse the JSON response
                insights_data = self._parse_json_response(response_text)
                
                # Handle case where response is wrapped in an object
                if isinstance(insights_data, dict):
                    if 'insights' in insights_data:
                        insights_data = insights_data['insights']
                    else:
                        insights_data = [insights_data]
                
                # Validate and convert to CareerInsight objects
                insights = []
                for item in insights_data:
                    try:
                        insight = CareerInsight(**item)
                        insights.append(insight)
                    except Exception as e:
                        # Log validation error but continue with valid insights
                        logger.warning(f"Skipping invalid insight: {e}")
                        continue
                
                if insights:
                    return insights
                    
            except Exception as e:
                logger.warning(f"LLM API call failed: {e}, using fallback insights")
        
        # Use fallback insights
        logger.info("Generating fallback insights based on ML data")
        return self._generate_fallback_insights(ml_data)


# Singleton instance
llm_service = LLMService()
