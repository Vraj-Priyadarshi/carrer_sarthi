from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum


# ============== Input Schemas (ML Data) ==============

class RecommendedSkill(BaseModel):
    skill: str
    confidence: float


class SkillGapData(BaseModel):
    skill_gap_score: float
    time_to_ready_months: float
    recommended_skills: List[RecommendedSkill]
    status: str


class RecommendedCourse(BaseModel):
    title: str
    difficulty: str
    duration_weeks: int
    skills_covered: List[str]


class RecommendedProject(BaseModel):
    title: str
    difficulty: str
    duration_weeks: int
    skills_required: List[str]


class CareerRecommendationData(BaseModel):
    target_role: str
    target_sector: str
    recommended_courses: List[RecommendedCourse]
    recommended_projects: List[RecommendedProject]


class MLDataInput(BaseModel):
    skill_gap: SkillGapData
    career_recommendation: CareerRecommendationData


# ============== Output Schemas (LLM Insights) ==============

class InsightType(str, Enum):
    MARKET_WEIGHTED_SKILL_PRIORITY = "Market-Weighted Skill Priority"
    COURSE_VS_PROJECT_MARKET_ROI = "Course vs Project Market ROI"
    INTERVIEW_RISK_ALERT = "Interview Risk Alert"
    SKILL_TIMING_FRESHNESS = "Skill Timing & Freshness"
    ADJACENT_MARKET_OPPORTUNITY = "Adjacent Market Opportunity"


class CareerInsight(BaseModel):
    insight_type: str = Field(..., description="One of the defined insight categories")
    title: str = Field(..., description="Short, sharp headline")
    insight: str = Field(..., description="1-2 sentence explanation rooted in market reality")
    why_it_is_overlooked: str = Field(..., description="Why professionals often miss this")
    recommended_action: str = Field(..., description="Clear next step the user should take")


class InsightsResponse(BaseModel):
    success: bool
    insights: List[CareerInsight]
    meta: Optional[dict] = None


class ErrorResponse(BaseModel):
    success: bool = False
    error: str
    detail: Optional[str] = None
