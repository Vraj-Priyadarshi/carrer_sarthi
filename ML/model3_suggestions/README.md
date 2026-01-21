# Career Intelligence API

AI-powered career insights generator using FastAPI and OpenAI GPT.

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment

Edit the `.env` file and add your OpenAI API key:

```env
OPENAI_API_KEY=your_actual_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
```

### 3. Run the Server

```bash
python run.py
```

Or using uvicorn directly:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### Generate Insights

**POST** `/api/v1/insights`

Generate career insights from your ML model data.

**Request Body:**

```json
{
  "skill_gap": {
    "skill_gap_score": 8.97,
    "time_to_ready_months": 2.39,
    "recommended_skills": [
      { "skill": "Budget Planning", "confidence": 16.4 },
      { "skill": "Clinical Trials", "confidence": 14.03 },
      { "skill": "Healthcare Analytics", "confidence": 10.8 }
    ],
    "status": "Ready"
  },
  "career_recommendation": {
    "target_role": "health_data_analyst",
    "target_sector": "healthcare_technology",
    "recommended_courses": [
      {
        "title": "HL7 and FHIR Standards Mastery",
        "difficulty": "Intermediate",
        "duration_weeks": 6,
        "skills_covered": ["HL7 Protocol", "FHIR Standards", "Data Exchange"]
      },
      {
        "title": "Healthcare Data Fundamentals",
        "difficulty": "Beginner",
        "duration_weeks": 4,
        "skills_covered": ["EHR Systems", "Healthcare Terminology"]
      }
    ],
    "recommended_projects": [
      {
        "title": "EHR Data Quality Assessment",
        "difficulty": "Intermediate",
        "duration_weeks": 4,
        "skills_required": ["Healthcare Data Standards", "SQL"]
      },
      {
        "title": "Population Health Dashboard",
        "difficulty": "Advanced",
        "duration_weeks": 6,
        "skills_required": ["Data Visualization", "Population Analytics"]
      }
    ]
  }
}
```

**Response:**

```json
{
  "success": true,
  "insights": [
    {
      "insight_type": "Market-Weighted Skill Priority",
      "title": "Healthcare Analytics Trumps Budget Planning",
      "insight": "Despite Budget Planning having a higher gap score, Healthcare Analytics skills are 3x more frequently listed in health_data_analyst job postings.",
      "why_it_is_overlooked": "Candidates focus on gap percentage rather than market demand signals.",
      "recommended_action": "Prioritize Healthcare Analytics learning before Budget Planning."
    }
  ],
  "meta": {
    "total_insights": 4,
    "target_role": "health_data_analyst",
    "skill_gap_score": 8.97
  }
}
```

### Demo Endpoint

**POST** `/api/v1/insights/demo`

Test the API with pre-configured sample data (no request body needed).

### Health Check

**GET** `/api/v1/health`

Check if the API is running.

## Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

```
ing/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration settings
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py       # Pydantic models
│   ├── routers/
│   │   ├── __init__.py
│   │   └── insights.py      # API routes
│   └── services/
│       ├── __init__.py
│       ├── llm_service.py   # OpenAI integration
│       └── prompt_builder.py # Prompt construction
├── .env                     # Environment variables
├── .env.example             # Example env file
├── requirements.txt         # Dependencies
├── run.py                   # Entry point
└── README.md
```

## Testing with cURL

```bash
# Health check
curl http://localhost:8000/api/v1/health

# Demo endpoint
curl -X POST http://localhost:8000/api/v1/insights/demo

# Full request
curl -X POST http://localhost:8000/api/v1/insights \
  -H "Content-Type: application/json" \
  -d '{"skill_gap":{"skill_gap_score":8.97,"time_to_ready_months":2.39,"recommended_skills":[{"skill":"Budget Planning","confidence":16.4}],"status":"Ready"},"career_recommendation":{"target_role":"health_data_analyst","target_sector":"healthcare_technology","recommended_courses":[],"recommended_projects":[]}}'
```
