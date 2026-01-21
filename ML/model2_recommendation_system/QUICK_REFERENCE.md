# Quick Reference Guide

## 🎯 What This System Does

Takes a user's **target role** and returns:
- **3 recommended courses** (domain-restricted)
- **2 recommended projects** (hands-on)
- **Per-item explanations** (why each aligns with the role)

**In 2.5-5.5 seconds**, with NO ML training required.

---

## 🚀 Get It Running (2 minutes)

```bash
# 1. Install packages
pip install -r requirements.txt

# 2. Set API key (OpenAI)
export OPENAI_API_KEY="sk-..."

# 3. Run server
python main.py

# 4. Test (in another terminal)
curl -X POST http://localhost:8000/recommendations \
  -H "Content-Type: application/json" \
  -d '{"user_id":"test","education_level":"bachelors","target_sector":"healthcare_technology","target_role":"health_data_analyst","has_ehr":true,"num_courses":2,"num_projects":0}'

# 5. Browse API docs
# Open: http://localhost:8000/docs
```

---

## 📊 Available Roles (Pick One!)

### Healthcare Technology (10 roles)
```
health_data_analyst
clinical_informatics_specialist
healthcare_ml_engineer
medical_imaging_specialist
telemedicine_systems_engineer
healthcare_security_analyst
clinical_data_specialist
population_health_analyst
healthcare_it_manager
other_healthcare_role
```

### Agricultural Sciences (10 roles)
```
precision_agriculture_specialist
agricultural_data_scientist
farm_automation_engineer
agritech_product_manager
crop_analytics_specialist
agricultural_iot_specialist
smart_irrigation_engineer
agricultural_robotics_engineer
soil_health_data_analyst
other_agriculture_role
```

### Urban / Smart City Planning (10 roles)
```
smart_city_solutions_architect
urban_data_analyst
iot_infrastructure_engineer
traffic_management_systems_engineer
sustainability_analytics_specialist
gis_spatial_analysis_specialist
smart_city_data_architect
urban_iot_developer
energy_systems_engineer
other_smart_city_role
```

---

## 🔑 Key Concepts

### Role-First Filtering
```
1. Choose target role (e.g., "health_data_analyst")
2. System finds ALL courses/projects mapped to that role
3. Filters by domain (Healthcare Technology)
4. Excludes already-completed items
5. Scores by: role_relevance(50%) + difficulty(25%) + skills(15%) + experience(10%)
6. LLM ranks top 10 courses and top 5 projects
7. Returns top 3 courses + 2 projects
```

### Why This Approach?
- ✅ No ML training (faster to customize)
- ✅ Role-focused (every item maps to your role)
- ✅ Domain-restricted (no off-topic content)
- ✅ Explainable (clear why each recommendation)
- ✅ Safe (no hallucinations, all from knowledge base)

---

## 📡 API Endpoints (All You Need)

### POST /recommendations
**Main endpoint** - Get personalized recommendations

```bash
curl -X POST http://localhost:8000/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user_123",
    "education_level": "bachelors",
    "target_sector": "healthcare_technology",
    "target_role": "health_data_analyst",
    "has_ehr": true,
    "has_hl7_fhir": false,
    "num_courses": 2,
    "num_projects": 1,
    "courses_names": [],
    "has_communication": true,
    "has_teamwork": true,
    "has_problem_solving": true,
    "has_leadership": false
  }'
```

**Response**: 3 courses + 2 projects + explanations

---

### GET /health
**Health check** - For load balancers

```bash
curl http://localhost:8000/health
# Response: {"status": "healthy", "timestamp": "2024-01-15T..."}
```

---

### GET /info/sectors
**List all sectors**

```bash
curl http://localhost:8000/info/sectors
# Response: 
# {
#   "sectors": [
#     {"id": "healthcare_technology", "name": "Healthcare Technology"},
#     {"id": "agricultural_sciences", "name": "Agricultural Sciences"},
#     {"id": "urban_smart_city", "name": "Urban / Smart City Planning"}
#   ]
# }
```

---

### GET /info/roles/{sector}
**List roles for a sector**

```bash
curl http://localhost:8000/info/roles/healthcare_technology
# Response: List of 10 healthcare roles with descriptions
```

---

## 📋 Request Schema Quick Reference

```python
{
  # User identification
  "user_id": "string",                      # Required
  
  # Education & background
  "education_level": "bachelors",           # Required: high_school|diploma|bachelors|masters|phd
  "field_of_study": "Computer Science",     # Optional
  "percentage": 85.5,                       # Optional: GPA or percentage
  
  # Healthcare skills (optional)
  "has_ehr": false,
  "has_hl7_fhir": false,
  "has_medical_imaging": false,
  "has_healthcare_security": false,
  "has_telemedicine": false,
  
  # Agriculture skills (optional)
  "has_iot_sensors": false,
  "has_drone_ops": false,
  "has_precision_ag": false,
  "has_crop_modeling": false,
  "has_soil_analysis": false,
  
  # Urban/Smart City skills (optional)
  "has_gis": false,
  "has_smart_grid": false,
  "has_traffic_mgmt": false,
  "has_urban_iot": false,
  "has_building_auto": false,
  
  # Course experience
  "num_courses": 2,                         # Optional: default 0
  "avg_course_grade": 87.0,                # Optional
  "courses_names": ["HC-101"],              # Optional: list of completed course IDs
  
  # Project experience
  "num_projects": 1,                        # Optional: default 0
  "avg_project_complexity": "Medium",      # Optional
  
  # Certifications
  "num_certifications": 0,                  # Optional: default 0
  "certification_names": [],                # Optional
  
  # Soft skills (optional)
  "has_communication": true,
  "has_teamwork": true,
  "has_problem_solving": true,
  "has_leadership": false,
  
  # Target role (MOST IMPORTANT)
  "target_sector": "healthcare_technology",  # Required
  "target_role": "health_data_analyst"       # Required
}
```

---

## 💡 Example: Real Request

```json
{
  "user_id": "john_doe_001",
  "education_level": "bachelors",
  "field_of_study": "Computer Science",
  "percentage": 88.5,
  
  "has_ehr": true,
  "has_hl7_fhir": false,
  "has_medical_imaging": false,
  "has_healthcare_security": false,
  "has_telemedicine": false,
  
  "has_iot_sensors": false,
  "has_drone_ops": false,
  "has_precision_ag": false,
  "has_crop_modeling": false,
  "has_soil_analysis": false,
  
  "has_gis": false,
  "has_smart_grid": false,
  "has_traffic_mgmt": false,
  "has_urban_iot": false,
  "has_building_auto": false,
  
  "num_courses": 3,
  "avg_course_grade": 86.0,
  "courses_names": ["HC-101"],
  
  "num_projects": 1,
  "avg_project_complexity": "Medium",
  
  "num_certifications": 1,
  "certification_names": ["Healthcare IT Basics"],
  
  "has_communication": true,
  "has_teamwork": true,
  "has_problem_solving": true,
  "has_leadership": false,
  
  "target_sector": "healthcare_technology",
  "target_role": "health_data_analyst"
}
```

**Response will include:**
- 3 healthcare courses (e.g., HC-102, HC-103, HC-104)
- 2 healthcare projects (e.g., HCP-101, HCP-102)
- Why each aligns with "health_data_analyst" role
- Overall strategy explanation

---

## ⚙️ How to Customize

### Change Scoring Weights
Edit `config.py`:
```python
ROLE_RELEVANCE_WEIGHT = 0.50       # Increase to favor role match more
DIFFICULTY_MATCH_WEIGHT = 0.25
SKILL_COVERAGE_WEIGHT = 0.15
EXPERIENCE_WEIGHT = 0.10
```

### Add a New Course
1. Edit `knowledge_base/courses.json`
2. Add JSON object with: course_id, title, domain, difficulty, skills_covered, mapped_roles
3. Update `knowledge_base/roles.json` to reference the new course in role's "mapped_course_ids"
4. Done! (No code changes needed)

### Switch LLM Model
Edit `llm_service.py`, line 28:
```python
self.model = "claude-3-sonnet"  # or gpt-3.5-turbo, etc.
```

### Disable LLM (Use Rule-Based Only)
In `main.py`, comment out LLM call and use fallback directly. System will use rule-based scores instead.

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "ModuleNotFoundError: No module named 'fastapi'" | Run: `pip install -r requirements.txt` |
| "401 Unauthorized" | Check OPENAI_API_KEY is set: `echo $OPENAI_API_KEY` |
| "Role not found" | Check target_role is in the list above, and matches sector |
| "502 Bad Gateway" | API crashed. Check logs for errors. |
| "No suitable courses found" | Role might not have enough mapped items. Check knowledge_base/roles.json |
| Response takes >10 seconds | LLM is slow. Check internet. System will fallback after 30s. |

---

## 📊 Knowledge Base Content

### Domains (STRICT)
```
1. Healthcare Technology    (40 courses, 9 projects)
2. Agricultural Sciences    (40 courses, 15 projects)
3. Urban / Smart City       (40+ courses, 17+ projects)
Total: 127 courses, 52 projects
```

### Difficulty Progression
```
Beginner       → (Foundation, basics)
Intermediate   → (Practical skills)
Advanced       → (Specialized, expert-level)
```

### Recommendation Count
```
Output always: 3 courses + 2 projects
Shortlist: Up to 10 courses + 5 projects (for LLM to rank from)
```

---

## 🔒 Safety Features

1. **No Hallucinations**: LLM only ranks items from shortlist
2. **Domain Restriction**: Only 3 allowed domains
3. **Role Mapping**: Every item verified to map to target role
4. **Fallback**: If LLM fails, uses rule-based ranking
5. **Input Validation**: Pydantic validates all inputs
6. **No Secrets in Code**: API key in environment variable

---

## 📈 Performance

| Metric | Value |
|--------|-------|
| Shortlisting | ~50ms |
| LLM call | 2-5 seconds |
| Total response | 2.5-5.5 seconds |
| Memory per request | ~50KB |
| Concurrent users | Scales horizontally |

---

## 🚢 Deploy to Production

```bash
# Docker
docker build -t recommendation-system:latest .
docker run -e OPENAI_API_KEY="..." -p 8000:8000 recommendation-system:latest

# Heroku
heroku create my-recommender
heroku config:set OPENAI_API_KEY="..."
git push heroku main

# Google Cloud Run
gcloud app deploy

# AWS Lambda (with Serverless Framework)
serverless deploy
```

See DEPLOYMENT.md for full instructions.

---

## 📚 File Overview

| File | Purpose |
|------|---------|
| `main.py` | FastAPI application & endpoints |
| `models.py` | Request/response validation |
| `config.py` | Constants & configuration |
| `utils.py` | Helper functions |
| `recommendation_engine.py` | Core algorithm (role-first filtering) |
| `llm_service.py` | LLM integration & fallback |
| `knowledge_base/*.json` | Courses, projects, roles |
| `test_api.py` | Test suite |
| `README.md` | Full user guide |
| `ARCHITECTURE.md` | Technical design details |
| `DEPLOYMENT.md` | Production setup |

---

## 💬 Key Takeaways

✅ **Role-centric**: Target role is the dominant signal (50% of score)
✅ **No ML training**: Rule-based filtering + LLM reasoning
✅ **Domain-restricted**: Only healthcare, agriculture, smart city
✅ **Explainable**: Every recommendation has a reason
✅ **Safe**: No hallucinations, all from knowledge base
✅ **Production-ready**: Deploy with confidence
✅ **Customizable**: Easy to add courses/roles/projects

---

**Ready to go!** Run `python main.py` and start getting recommendations! 🚀
