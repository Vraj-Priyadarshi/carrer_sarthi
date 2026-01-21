"""
LLM service for ranking recommendations and generating explanations.
Uses OpenAI/Claude API via LiteLLM for flexibility.
"""

import os
import json
import logging
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime

logger = logging.getLogger(__name__)

# Try to import litellm, fall back gracefully if not available
try:
    import litellm
    HAS_LITELLM = True
except ImportError:
    HAS_LITELLM = False
    logger.warning("litellm not installed, using mock LLM responses")

# Check if valid API key is configured
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
HAS_VALID_API_KEY = bool(OPENAI_API_KEY and not OPENAI_API_KEY.startswith("sk-your") and len(OPENAI_API_KEY) > 20)

if not HAS_VALID_API_KEY:
    logger.info("No valid API key configured, using fallback rule-based recommendations")


class LLMService:
    """
    Service for LLM-based ranking and explanation generation.
    
    Rules:
    - LLM is ONLY for ranking items from the shortlist
    - LLM CANNOT invent new courses or projects
    - LLM MUST return valid JSON only
    - Fallback to rule-based ranking if LLM fails
    """
    
    def __init__(
        self,
        model: str = "openai/gpt-oss-20b",
        temperature: float = 0.7,
        max_tokens: int = 2000,
        skip_llm: bool = False,
    ):
        """Initialize LLM service."""
        self.model = model
        self.temperature = temperature
        self.max_tokens = max_tokens
        self.skip_llm = skip_llm or not HAS_VALID_API_KEY or not HAS_LITELLM
        
        if self.skip_llm:
            logger.info("LLMService initialized in FALLBACK mode (rule-based recommendations)")
        else:
            logger.info(f"LLMService initialized with model: {model}")
    
    def rank_and_explain(
        self,
        target_role: str,
        target_sector: str,
        shortlisted_courses: List[Dict[str, Any]],
        shortlisted_projects: List[Dict[str, Any]],
        user_profile: Dict[str, Any],
        num_recommended_courses: int = 3,
        num_recommended_projects: int = 2,
    ) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]], str]:
        """
        Use LLM to rank shortlisted items and provide explanations.
        
        Returns:
            (ranked_courses, ranked_projects, reasoning)
        """
        
        logger.info(f"Ranking for role: {target_role}")
        
        # Skip LLM if configured to do so (no valid API key)
        if self.skip_llm:
            logger.info("Using fallback rule-based ranking (LLM disabled)")
            return self._fallback_ranking(
                shortlisted_courses,
                shortlisted_projects,
                num_recommended_courses,
                num_recommended_projects,
                target_role,
            )
        
        # Build the prompt
        prompt = self._build_prompt(
            target_role=target_role,
            target_sector=target_sector,
            shortlisted_courses=shortlisted_courses,
            shortlisted_projects=shortlisted_projects,
            user_profile=user_profile,
            num_recommended_courses=num_recommended_courses,
            num_recommended_projects=num_recommended_projects,
        )
        
        # Call LLM
        try:
            response_text = self._call_llm(prompt)
            
            # Parse response
            result = self._parse_llm_response(response_text)
            
            if result:
                return (
                    result.get('ranked_courses', []),
                    result.get('ranked_projects', []),
                    result.get('reasoning', ''),
                )
            else:
                logger.warning("Failed to parse LLM response, using fallback ranking")
                return self._fallback_ranking(
                    shortlisted_courses,
                    shortlisted_projects,
                    num_recommended_courses,
                    num_recommended_projects,
                    target_role,
                )
        
        except Exception as e:
            logger.error(f"LLM call failed: {e}, using fallback ranking")
            return self._fallback_ranking(
                shortlisted_courses,
                shortlisted_projects,
                num_recommended_courses,
                num_recommended_projects,
                target_role,
            )
    
    def _build_prompt(
        self,
        target_role: str,
        target_sector: str,
        shortlisted_courses: List[Dict[str, Any]],
        shortlisted_projects: List[Dict[str, Any]],
        user_profile: Dict[str, Any],
        num_recommended_courses: int,
        num_recommended_projects: int,
    ) -> str:
        """Build the LLM prompt."""
        
        courses_json = json.dumps(shortlisted_courses, indent=2)
        projects_json = json.dumps(shortlisted_projects, indent=2)
        user_json = json.dumps(user_profile, indent=2)
        
        prompt = f"""You are an expert educational advisor specializing in role-based learning paths.

TARGET ROLE: {target_role}
TARGET SECTOR: {target_sector}

USER PROFILE:
{user_json}

SHORTLISTED COURSES (role-filtered and domain-restricted):
{courses_json}

SHORTLISTED PROJECTS (role-filtered and domain-restricted):
{projects_json}

TASK:
1. Rank the courses by relevance to the target role (highest priority)
2. Rank the projects by relevance to the target role (highest priority)
3. Select the top {num_recommended_courses} COURSES and top {num_recommended_projects} PROJECTS
4. Provide ONE concise explanation per recommendation

CRITICAL CONSTRAINTS:
- ONLY recommend from the provided lists (NO HALLUCINATIONS)
- Prioritize TARGET ROLE relevance above all else
- Each explanation must be 1-2 sentences
- Return VALID JSON ONLY (no markdown, no extra text)

RETURN FORMAT (STRICT JSON):
{{
  "ranked_courses": [
    {{
      "course_id": "...",
      "title": "...",
      "domain": "...",
      "difficulty": "...",
      "duration_weeks": ...,
      "skills_covered": [...],
      "explanation": "Why this course aligns with {target_role}"
    }}
  ],
  "ranked_projects": [
    {{
      "project_id": "...",
      "title": "...",
      "domain": "...",
      "difficulty": "...",
      "complexity": "...",
      "duration_weeks": ...,
      "skills_required": [...],
      "explanation": "Why this project aligns with {target_role}"
    }}
  ],
  "reasoning": "Overall recommendation strategy (1-2 sentences)"
}}
"""
        
        return prompt
    
    def _call_llm(self, prompt: str) -> str:
        """Call LLM via litellm."""
        
        try:
            response = litellm.completion(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=self.temperature,
                max_tokens=self.max_tokens,
                timeout=30,
            )
            
            return response.choices[0].message.content
        
        except Exception as e:
            logger.error(f"LiteLLM call failed: {e}")
            raise
    
    def _parse_llm_response(self, response_text: str) -> Optional[Dict[str, Any]]:
        """Parse JSON response from LLM."""
        
        try:
            # Try direct JSON parsing
            result = json.loads(response_text)
            
            # Validate structure
            if 'ranked_courses' not in result or 'ranked_projects' not in result:
                logger.warning("Response missing required fields")
                return None
            
            return result
        
        except json.JSONDecodeError:
            # Try to extract JSON from markdown code blocks
            try:
                if '```json' in response_text:
                    start = response_text.find('```json') + 7
                    end = response_text.find('```', start)
                    json_str = response_text[start:end].strip()
                    result = json.loads(json_str)
                    return result
                elif '```' in response_text:
                    start = response_text.find('```') + 3
                    end = response_text.find('```', start)
                    json_str = response_text[start:end].strip()
                    result = json.loads(json_str)
                    return result
            except:
                pass
            
            logger.warning("Failed to parse LLM response as JSON")
            return None
    
    def _fallback_ranking(
        self,
        shortlisted_courses: List[Dict[str, Any]],
        shortlisted_projects: List[Dict[str, Any]],
        num_recommended_courses: int,
        num_recommended_projects: int,
        target_role: str = "your target role",
    ) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]], str]:
        """Fallback to rule-based ranking when LLM fails."""
        
        logger.info("Using fallback rule-based ranking")
        
        # Format role name for display
        role_display = target_role.replace("_", " ").title()
        
        # Sort by score (already computed in recommendation_engine)
        ranked_courses = sorted(
            shortlisted_courses,
            key=lambda x: x.get('_score', 0),
            reverse=True
        )[:num_recommended_courses]
        
        ranked_projects = sorted(
            shortlisted_projects,
            key=lambda x: x.get('_score', 0),
            reverse=True
        )[:num_recommended_projects]
        
        # Add contextual explanations based on course/project data
        for i, course in enumerate(ranked_courses):
            skills = course.get('skills_covered', [])
            skill_text = f"covering {', '.join(skills[:2])}" if skills else "with comprehensive coverage"
            difficulty = course.get('difficulty', 'Intermediate')
            course['explanation'] = f"Essential {difficulty.lower()}-level foundation for {role_display}, {skill_text}. Recommended as priority #{i+1} based on skill alignment."
        
        for i, project in enumerate(ranked_projects):
            skills = project.get('skills_required', [])
            skill_text = f"applying {', '.join(skills[:2])}" if skills else "with practical application"
            project['explanation'] = f"Hands-on experience {skill_text}, directly relevant to {role_display} responsibilities. Builds portfolio-worthy work."
        
        # Remove internal scoring field
        for item in ranked_courses + ranked_projects:
            item.pop('_score', None)
        
        reasoning = f"Recommendations optimized for {role_display} role alignment, prioritizing foundational skills and practical experience."
        
        return ranked_courses, ranked_projects, reasoning
    
    def _mock_llm_response(
        self,
        shortlisted_courses: List[Dict[str, Any]],
        shortlisted_projects: List[Dict[str, Any]],
        num_recommended_courses: int,
        num_recommended_projects: int,
    ) -> str:
        """Generate mock LLM response for testing."""
        
        selected_courses = sorted(
            shortlisted_courses,
            key=lambda x: x.get('_score', 0),
            reverse=True
        )[:num_recommended_courses]
        
        selected_projects = sorted(
            shortlisted_projects,
            key=lambda x: x.get('_score', 0),
            reverse=True
        )[:num_recommended_projects]
        
        # Add explanations
        for course in selected_courses:
            course['explanation'] = f"Essential foundation for mastering {course.get('title', 'this skill')}."
        
        for project in selected_projects:
            project['explanation'] = f"Practical hands-on experience applying {project.get('title', 'key concepts')}."
        
        response = {
            "ranked_courses": selected_courses,
            "ranked_projects": selected_projects,
            "reasoning": "Recommendations are based on role alignment and progressive skill building."
        }
        
        return json.dumps(response, indent=2)
