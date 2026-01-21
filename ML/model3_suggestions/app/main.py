from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import insights

app = FastAPI(
    title="Career Intelligence API",
    description="""
    ## AI-Powered Career Insights Generator
    
    This API takes ML model outputs (skill gap analysis and career recommendations)
    and generates actionable, market-aware career insights using LLM.
    
    ### Features:
    - **Skill Gap Analysis Processing**: Analyzes skill gaps and prioritizes based on market demand
    - **Career Recommendation Enhancement**: Provides ROI-focused learning path recommendations
    - **Market-Aware Insights**: Generates insights based on current hiring trends
    - **Interview Risk Alerts**: Identifies potential interview failure points
    
    ### Endpoints:
    - `POST /api/v1/insights` - Generate insights from your ML data
    - `POST /api/v1/insights/demo` - Test with sample data
    - `GET /api/v1/health` - Health check
    """,
    version="1.0.0",
    contact={
        "name": "Career Intelligence Team",
    },
    license_info={
        "name": "MIT",
    }
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(insights.router)


@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint with API information.
    """
    return {
        "message": "Welcome to Career Intelligence API",
        "docs": "/docs",
        "redoc": "/redoc",
        "health": "/api/v1/health"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
