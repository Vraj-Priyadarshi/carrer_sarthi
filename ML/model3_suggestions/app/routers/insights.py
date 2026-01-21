from fastapi import APIRouter, HTTPException
from app.models.schemas import (
    MLDataInput, 
    InsightsResponse, 
    ErrorResponse,
    SkillGapData,
    CareerRecommendationData,
    RecommendedSkill,
    RecommendedCourse,
    RecommendedProject
)
from app.services.llm_service import llm_service

router = APIRouter(prefix="/api/v1", tags=["Career Insights"])


@router.post(
    "/insights",
    response_model=InsightsResponse,
    responses={
        400: {"model": ErrorResponse},
        500: {"model": ErrorResponse}
    },
    summary="Generate Career Insights",
    description="Generate AI-powered career insights based on ML skill gap and career recommendation data."
)
async def generate_insights(ml_data: MLDataInput):
    """
    Generate career insights from ML model outputs.
    
    Takes skill gap analysis and career recommendation data,
    processes it through the LLM, and returns actionable insights.
    """
    try:
        insights = await llm_service.generate_career_insights(ml_data)
        
        return InsightsResponse(
            success=True,
            insights=insights,
            meta={
                "total_insights": len(insights),
                "target_role": ml_data.career_recommendation.target_role,
                "skill_gap_score": ml_data.skill_gap.skill_gap_score
            }
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post(
    "/insights/demo",
    response_model=InsightsResponse,
    summary="Demo Endpoint with Sample Data",
    description="Test the insights generation with pre-configured sample ML data."
)
async def generate_demo_insights():
    """
    Demo endpoint that uses sample ML data for testing.
    """
    # Sample ML data matching the user's example
    sample_data = MLDataInput(
        skill_gap=SkillGapData(
            skill_gap_score=8.97,
            time_to_ready_months=2.39,
            recommended_skills=[
                RecommendedSkill(skill="Budget Planning", confidence=16.4),
                RecommendedSkill(skill="Clinical Trials", confidence=14.03),
                RecommendedSkill(skill="Healthcare Analytics", confidence=10.8)
            ],
            status="Ready"
        ),
        career_recommendation=CareerRecommendationData(
            target_role="health_data_analyst",
            target_sector="healthcare_technology",
            recommended_courses=[
                RecommendedCourse(
                    title="HL7 and FHIR Standards Mastery",
                    difficulty="Intermediate",
                    duration_weeks=6,
                    skills_covered=["HL7 Protocol", "FHIR Standards", "Data Exchange"]
                ),
                RecommendedCourse(
                    title="Healthcare Data Fundamentals",
                    difficulty="Beginner",
                    duration_weeks=4,
                    skills_covered=["EHR Systems", "Healthcare Terminology"]
                )
            ],
            recommended_projects=[
                RecommendedProject(
                    title="EHR Data Quality Assessment",
                    difficulty="Intermediate",
                    duration_weeks=4,
                    skills_required=["Healthcare Data Standards", "SQL"]
                ),
                RecommendedProject(
                    title="Population Health Dashboard",
                    difficulty="Advanced",
                    duration_weeks=6,
                    skills_required=["Data Visualization", "Population Analytics"]
                )
            ]
        )
    )
    
    try:
        insights = await llm_service.generate_career_insights(sample_data)
        
        return InsightsResponse(
            success=True,
            insights=insights,
            meta={
                "total_insights": len(insights),
                "target_role": sample_data.career_recommendation.target_role,
                "skill_gap_score": sample_data.skill_gap.skill_gap_score,
                "demo": True
            }
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get(
    "/health",
    summary="Health Check",
    description="Check if the API is running."
)
async def health_check():
    """
    Simple health check endpoint.
    """
    return {"status": "healthy", "service": "Career Intelligence API"}
