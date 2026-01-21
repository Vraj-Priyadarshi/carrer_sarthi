"""
FastAPI application for role-centric recommendation system.

Endpoint: POST /recommendations
Input: User profile and target role/sector
Output: 3 recommended courses + 2 recommended projects with explanations
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from root .env file
root_env = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(root_env)

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging
from datetime import datetime

from models import (
    RecommendationRequest,
    RecommendationResponse,
    CourseRecommendation,
    ProjectRecommendation,
    ErrorResponse,
)
from recommendation_engine import RecommendationEngine
from llm_service import LLMService
from utils import extract_completed_course_ids

# ==================== LOGGING SETUP ====================
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger(__name__)

# ==================== DEPENDENCY INJECTION ====================
recommendation_engine = None
llm_service = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler for startup and shutdown."""
    # Startup
    global recommendation_engine, llm_service
    try:
        recommendation_engine = RecommendationEngine()
        llm_service = LLMService(
            model="openai/gpt-oss-20b",
            temperature=0.7,
            max_tokens=2000,
        )
        logger.info("Services initialized successfully")
        logger.info("Application started")
    except Exception as e:
        logger.error(f"Failed to initialize services: {e}")
        raise
    
    yield
    
    # Shutdown
    logger.info("Application shutting down")


# ==================== FASTAPI SETUP ====================
app = FastAPI(
    title="Role-Centric Recommendation System",
    description="Educational recommendations driven by target role and sector",
    version="1.0.0",
    lifespan=lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== HEALTH CHECK ====================
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
    }


# ==================== MAIN RECOMMENDATION ENDPOINT ====================
@app.post(
    "/recommendations",
    response_model=RecommendationResponse,
    summary="Get personalized learning recommendations",
    tags=["Recommendations"],
)
async def get_recommendations(request: RecommendationRequest) -> RecommendationResponse:
    """
    Generate personalized learning recommendations based on target role.
    
    **Flow:**
    1. Validate and normalize input
    2. Load target role profile
    3. Shortlist courses by domain + role relevance
    4. Shortlist projects by domain + role relevance
    5. Use LLM to rank and explain recommendations
    6. Return 3 courses + 2 projects
    
    **Key Features:**
    - Role-first filtering (target role is dominant signal)
    - Domain-restricted (only healthcare, agriculture, smart city)
    - No ML training (rule-based + LLM reasoning only)
    - Explainable recommendations
    """
    
    try:
        logger.info(f"Processing recommendation request for user: {request.user_id}")
        
        # ===== INPUT VALIDATION =====
        if not request.target_role or not request.target_sector:
            raise ValueError("target_role and target_sector are required")
        
        logger.info(f"Target: {request.target_role} in {request.target_sector}")
        
        # ===== STEP 1: GET ROLE PROFILE =====
        role_profile = recommendation_engine.get_role_profile(
            request.target_role,
            request.target_sector,
        )
        
        if not role_profile:
            logger.warning(f"Role not found: {request.target_role}")
            raise ValueError(f"Target role '{request.target_role}' not found or invalid for sector '{request.target_sector}'")
        
        logger.info(f"Found role profile: {role_profile.get('role_name', request.target_role)}")
        
        # ===== STEP 2: PREPARE COMPLETED ITEMS =====
        # Extract course IDs from names
        completed_course_ids = extract_completed_course_ids(request.courses_names)
        completed_project_ids = []  # Projects typically tracked by ID, not name
        
        logger.info(f"Completed courses: {len(completed_course_ids)}, projects: {len(completed_project_ids)}")
        
        # ===== STEP 3: SHORTLIST COURSES & PROJECTS =====
        shortlisted_courses, shortlisted_projects = recommendation_engine.generate_shortlist_for_llm(
            target_sector=request.target_sector,
            target_role=request.target_role,
            education_level=request.education_level,
            num_courses_completed=request.num_courses,
            avg_course_grade=request.avg_course_grade,
            completed_course_ids=completed_course_ids,
            num_projects_completed=request.num_projects,
            completed_project_ids=completed_project_ids,
        )
        
        if not shortlisted_courses or not shortlisted_projects:
            logger.warning(f"Insufficient candidates for shortlisting (courses: {len(shortlisted_courses)}, projects: {len(shortlisted_projects)})")
            raise ValueError("No suitable courses or projects found for this role and sector combination")
        
        # ===== STEP 4: PREPARE USER PROFILE FOR LLM =====
        user_context = {
            "education_level": request.education_level,
            "experience": f"{request.num_courses} courses, {request.num_projects} projects",
            "skills": {
                "healthcare": request.has_ehr or request.has_hl7_fhir or request.has_medical_imaging or request.has_healthcare_security or request.has_telemedicine,
                "agriculture": request.has_iot_sensors or request.has_drone_ops or request.has_precision_ag or request.has_crop_modeling or request.has_soil_analysis,
                "urban_smart_city": request.has_gis or request.has_smart_grid or request.has_traffic_mgmt or request.has_urban_iot or request.has_building_auto,
                "soft_skills": {
                    "communication": request.has_communication,
                    "teamwork": request.has_teamwork,
                    "problem_solving": request.has_problem_solving,
                    "leadership": request.has_leadership,
                }
            }
        }
        
        # ===== STEP 5: LLM RANKING & EXPLANATION =====
        ranked_courses, ranked_projects, reasoning = llm_service.rank_and_explain(
            target_role=request.target_role,
            target_sector=request.target_sector,
            shortlisted_courses=shortlisted_courses,
            shortlisted_projects=shortlisted_projects,
            user_profile=user_context,
            num_recommended_courses=3,
            num_recommended_projects=2,
        )
        
        logger.info(f"LLM returned {len(ranked_courses)} courses and {len(ranked_projects)} projects")
        
        # ===== STEP 6: BUILD RESPONSE =====
        recommended_courses = [
            CourseRecommendation(
                course_id=c.get('course_id'),
                title=c.get('title'),
                domain=c.get('domain'),
                difficulty=c.get('difficulty'),
                duration_weeks=c.get('duration_weeks', 0),
                skills_covered=c.get('skills_covered', []),
                explanation=c.get('explanation', 'Recommended for your role'),
            )
            for c in ranked_courses[:3]
        ]
        
        recommended_projects = [
            ProjectRecommendation(
                project_id=p.get('project_id'),
                title=p.get('title'),
                domain=p.get('domain'),
                difficulty=p.get('difficulty'),
                complexity=p.get('complexity'),
                duration_weeks=p.get('duration_weeks', 0),
                skills_required=p.get('skills_required', []),
                explanation=p.get('explanation', 'Valuable hands-on experience for your role'),
            )
            for p in ranked_projects[:2]
        ]
        
        response = RecommendationResponse(
            user_id=request.user_id,
            target_role=request.target_role,
            target_sector=request.target_sector,
            recommended_courses=recommended_courses,
            recommended_projects=recommended_projects,
            reasoning=reasoning,
            generated_at=datetime.utcnow().isoformat(),
        )
        
        logger.info(f"Successfully generated recommendations for user {request.user_id}")
        return response
    
    except ValueError as e:
        logger.warning(f"Validation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    
    except Exception as e:
        logger.error(f"Unexpected error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error while generating recommendations",
        )


# ==================== DOCUMENTATION ENDPOINTS ====================
@app.get("/info/sectors")
async def get_sectors():
    """List available sectors."""
    return {
        "sectors": [
            {
                "id": "healthcare_technology",
                "name": "Healthcare Technology",
                "description": "Healthcare IT, medical data, clinical systems",
            },
            {
                "id": "agricultural_sciences",
                "name": "Agricultural Sciences",
                "description": "Precision agriculture, farm automation, crop analytics",
            },
            {
                "id": "urban_smart_city",
                "name": "Urban / Smart City Planning",
                "description": "Smart cities, IoT infrastructure, urban analytics",
            },
        ]
    }


@app.get("/info/roles/{sector}")
async def get_roles_for_sector(sector: str):
    """List available roles for a sector."""
    
    sector_mapping = {
        "healthcare_technology": "healthcare_technology",
        "agricultural_sciences": "agricultural_sciences",
        "urban_smart_city": "urban_smart_city",
    }
    
    sector_key = sector_mapping.get(sector.lower())
    if not sector_key:
        raise HTTPException(status_code=400, detail="Invalid sector")
    
    try:
        roles_db = recommendation_engine.roles_db
        sector_data = roles_db.get('sectors', {}).get(sector_key, {})
        roles = sector_data.get('roles', {})
        
        return {
            "sector": sector,
            "roles": [
                {
                    "id": role_id,
                    "name": role_data.get('role_name'),
                    "core_responsibilities": role_data.get('core_responsibilities', []),
                }
                for role_id, role_data in roles.items()
            ]
        }
    except Exception as e:
        logger.error(f"Error fetching roles: {e}")
        raise HTTPException(status_code=500, detail="Error fetching roles")


# ==================== ROOT ENDPOINT ====================
@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": "Role-Centric Recommendation System",
        "version": "1.0.0",
        "description": "Educational course and project recommendations driven by target role",
        "endpoints": {
            "post_recommendations": "/recommendations",
            "health": "/health",
            "sectors": "/info/sectors",
            "roles": "/info/roles/{sector}",
            "docs": "/docs",
            "redoc": "/redoc",
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
