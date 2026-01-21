# Role-Centric Course & Project Recommendation System

A production-ready backend recommendation system that matches users to courses and projects based on their **target role**, without using ML models.

---

## 📋 Overview

### Core Philosophy
- **Role-First Architecture**: Target role is the dominant signal for all recommendations
- **No ML Models**: Uses rule-based filtering + LLM for ranking (not training)
- **Domain-Restricted**: Only recommends from Healthcare Technology, Agricultural Sciences, and Urban/Smart City Planning
- **Explainable**: Every recommendation includes a clear explanation tied to the target role
- **Production-Safe**: No hallucinations, no invented courses/projects

### How It Works

```
Frontend Input (user_id, education_level, target_role, target_sector, ...)
        ↓
[Backend] Load Role Profile
        ↓
[Backend] Domain Filtering (strict)
        ↓
[Backend] Role-Relevance Filtering (highest priority)
        ↓
[Backend] Rule-Based Shortlisting (education + experience match)
        ↓
[LLM] Rank & Explain from shortlist ONLY
        ↓
Return 3 Courses + 2 Projects with explanations
```

---

## 🏗️ System Architecture

### Directory Structure

```
model2_recommendation_system/
├── knowledge_base/
│   ├── roles.json              # Role profiles with core skills and mappings
│   ├── courses.json            # Domain-restricted courses (127 total)
│   └── projects.json           # Domain-restricted projects (52 total)
├── main.py                     # FastAPI application
├── models.py                   # Pydantic request/response schemas
├── config.py                   # Constants, enums, mappings
├── utils.py                    # Utility functions
├── recommendation_engine.py    # Core recommendation logic (role-first filtering)
├── llm_service.py             # LLM integration with fallback
├── requirements.txt           # Python dependencies
└── README.md                  # This file
```

### Key Components

#### 1. **Knowledge Base** (`roles.json`, `courses.json`, `projects.json`)
- **roles.json**: 30 target roles across 3 sectors with core skills and role-to-item mappings
- **courses.json**: 127 courses covering Healthcare, Agriculture, Smart City domains
- **projects.json**: 52 real-world projects with hands-on experience

#### 2. **Recommendation Engine** (`recommendation_engine.py`)
Implements role-first filtering:
1. Load target role profile
2. Filter courses/projects by domain (strict)
3. Filter by role relevance (role must map to item)
4. Exclude completed items
5. Score by: role_relevance (50%) + difficulty_match (25%) + skill_coverage (15%) + experience (10%)
6. Return top N for LLM ranking

#### 3. **LLM Service** (`llm_service.py`)
- Calls OpenAI/Claude via LiteLLM
- **Prompt constraints**: Only rank items from shortlist, no inventions
- **Output format**: Strict JSON with explanations
- **Fallback**: If LLM fails, uses rule-based ranking

#### 4. **FastAPI Application** (`main.py`)
- `POST /recommendations` - Main endpoint
- `GET /health` - Health check
- `GET /info/sectors` - List sectors
- `GET /info/roles/{sector}` - List roles per sector

---

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- OpenAI API key (or Claude via LiteLLM)

### Installation

```bash
# 1. Navigate to project
cd model2_recommendation_system

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Set up environment variables
export OPENAI_API_KEY="your-api-key-here"
```

### Run the Server

```bash
python main.py
```

Server will start at `http://localhost:8000`

Visit `http://localhost:8000/docs` for interactive API documentation.

---

## 📊 API Usage

### Endpoint: `POST /recommendations`

#### Request Example

```json
{
  "user_id": "user_12345",
  "education_level": "bachelors",
  "field_of_study": "Computer Science",
  "percentage": 85.5,
  
  "has_ehr": false,
  "has_hl7_fhir": false,
  "has_medical_imaging": false,
  "has_healthcare_security": false,
  "has_telemedicine": false,
  
  "has_iot_sensors": true,
  "has_drone_ops": false,
  "has_precision_ag": true,
  "has_crop_modeling": false,
  "has_soil_analysis": true,
  
  "has_gis": false,
  "has_smart_grid": false,
  "has_traffic_mgmt": false,
  "has_urban_iot": false,
  "has_building_auto": false,
  
  "num_courses": 3,
  "avg_course_grade": 87.0,
  "courses_names": ["AG-101", "AG-102"],
  
  "num_projects": 1,
  "avg_project_complexity": "Medium",
  
  "num_certifications": 1,
  "certification_names": ["IoT Basics"],
  
  "has_communication": true,
  "has_teamwork": true,
  "has_problem_solving": true,
  "has_leadership": false,
  
  "target_sector": "agricultural_sciences",
  "target_role": "agricultural_iot_specialist"
}
```

#### Response Example

```json
{
  "user_id": "user_12345",
  "target_role": "agricultural_iot_specialist",
  "target_sector": "agricultural_sciences",
  "recommended_courses": [
    {
      "course_id": "AG-108",
      "title": "IoT Sensors and Networks for Agriculture",
      "domain": "Agricultural Sciences",
      "difficulty": "Intermediate",
      "duration_weeks": 6,
      "skills_covered": [
        "IoT Sensors",
        "Wireless Networks",
        "Data Logging",
        "Edge Computing",
        "Sensor Calibration"
      ],
      "explanation": "Essential foundation for your Agricultural IoT Specialist role, covering sensor deployment and wireless network architecture on farms."
    },
    {
      "course_id": "AG-113",
      "title": "IoT Data Integration for Farms",
      "domain": "Agricultural Sciences",
      "difficulty": "Intermediate",
      "duration_weeks": 6,
      "skills_covered": [
        "Data Integration",
        "API Development",
        "Real-time Data Processing",
        "Data Storage",
        "System Architecture"
      ],
      "explanation": "Directly supports your role by teaching integration of multiple farm IoT sources into unified platforms."
    },
    {
      "course_id": "AG-114",
      "title": "Edge Computing for Agriculture",
      "domain": "Agricultural Sciences",
      "difficulty": "Advanced",
      "duration_weeks": 7,
      "skills_covered": [
        "Edge Architecture",
        "Local Processing",
        "Real-time Analytics",
        "Connectivity Management",
        "System Resilience"
      ],
      "explanation": "Advances your IoT capabilities with edge computing skills essential for real-time farm decision-making."
    }
  ],
  "recommended_projects": [
    {
      "project_id": "AGP-105",
      "title": "Agricultural IoT System Deployment",
      "domain": "Agricultural Sciences",
      "difficulty": "Advanced",
      "complexity": "High",
      "duration_weeks": 8,
      "skills_required": [
        "IoT Systems",
        "Sensor Technology",
        "Network Setup",
        "Data Integration",
        "Field Work"
      ],
      "explanation": "Perfect capstone project to apply your IoT skills in real farm deployment, covering sensor selection through integration."
    },
    {
      "project_id": "AGP-110",
      "title": "Farm IoT Data Integration Pipeline",
      "domain": "Agricultural Sciences",
      "difficulty": "Advanced",
      "complexity": "High",
      "duration_weeks": 7,
      "skills_required": [
        "Data Integration",
        "API Development",
        "IoT Protocols",
        "Database Design",
        "Data Quality"
      ],
      "explanation": "Builds critical integration expertise for managing multiple IoT sources, essential for your IoT Specialist career path."
    }
  ],
  "reasoning": "Recommendations focus on IoT infrastructure and data integration skills that directly align with Agricultural IoT Specialist responsibilities. The progression starts with sensor fundamentals and moves to advanced integration and edge computing.",
  "generated_at": "2024-01-15T10:30:45.123456"
}
```

---

## 🔑 Key Features

### 1. Role-First Architecture
- Target role is used to filter courses/projects BEFORE education level
- Every recommended item maps to the target role in the knowledge base
- Ensures recommendations are always role-aligned

### 2. Domain Restriction
Only recommends from:
- **Healthcare Technology**: EHR, FHIR, medical imaging, health data, telemedicine
- **Agricultural Sciences**: Precision ag, IoT, drones, soil analysis, robotics
- **Urban/Smart City Planning**: Smart grids, traffic, GIS, IoT infrastructure, energy

### 3. Rule-Based Shortlisting
Scoring weights:
- **Role relevance**: 50%
- **Difficulty match**: 25%
- **Skill coverage**: 15%
- **Experience progression**: 10%

### 4. LLM for Ranking Only
- LLM receives ONLY the shortlisted items (max 10 courses, 5 projects)
- LLM prompt explicitly forbids hallucinations
- LLM returns strict JSON: ranking + per-item explanations
- **Fallback**: If LLM fails, uses rule-based score

### 5. Explainability
Every recommendation includes:
- Why it aligns with the target role
- What skills it covers
- How it fits the learning path

---

## 📚 Supported Sectors & Roles

### Healthcare Technology (10 roles)
- Health Data Analyst
- Clinical Informatics Specialist
- Healthcare ML Engineer
- Medical Imaging Specialist
- Telemedicine Systems Engineer
- Healthcare Security Analyst
- Clinical Data Specialist
- Population Health Analyst
- Healthcare IT Manager
- Other Healthcare Role

### Agricultural Sciences (10 roles)
- Precision Agriculture Specialist
- Agricultural Data Scientist
- Farm Automation Engineer
- AgriTech Product Manager
- Crop Analytics Specialist
- Agricultural IoT Specialist
- Smart Irrigation Engineer
- Agricultural Robotics Engineer
- Soil Health Data Analyst
- Other Agriculture Role

### Urban / Smart City Planning (10 roles)
- Smart City Solutions Architect
- Urban Data Analyst
- IoT Infrastructure Engineer
- Traffic Management Systems Engineer
- Sustainability Analytics Specialist
- GIS / Spatial Analysis Specialist
- Smart City Data Architect
- Urban IoT Developer
- Energy Systems Engineer
- Other Smart City Role

---

## 🛡️ Safety & Production Constraints

### Input Validation
- All education levels normalized
- All sectors/roles validated against knowledge base
- Completed items tracked to avoid duplicates

### Output Safety
- LLM prompt explicitly forbids hallucinations
- Only courses/projects from knowledge base recommended
- JSON validation on all responses
- Fallback ranking if LLM fails

### Explainability
- Every recommendation tied to target role
- No "black box" scoring
- Rule-based scores visible in logs
- LLM explanations required

---

## 🧪 Testing

### Mock LLM Mode (for development)
If `litellm` is not installed or API key missing, system uses mock responses:

```python
# Automatically detected in llm_service.py
if HAS_LITELLM:
    # Call real LLM
else:
    # Use mock response with same format
```

### Test Request via cURL

```bash
curl -X POST "http://localhost:8000/recommendations" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "education_level": "bachelors",
    "target_sector": "healthcare_technology",
    "target_role": "health_data_analyst",
    "num_courses": 2,
    "num_projects": 0,
    "courses_names": [],
    "has_ehr": true,
    "has_hl7_fhir": true
  }'
```

---

## 📊 Knowledge Base Statistics

| Category | Count | Coverage |
|----------|-------|----------|
| Total Roles | 30 | All 3 sectors |
| Total Courses | 127 | 40+ per sector |
| Total Projects | 52 | 17+ per sector |
| Supported Education Levels | 5 | HS to PhD |

---

## 🔧 Customization

### Adding a New Course
Edit `knowledge_base/courses.json`:

```json
{
  "course_id": "HC-NEW",
  "title": "Your Course Title",
  "domain": "Healthcare Technology",
  "description": "...",
  "difficulty": "Intermediate",
  "duration_weeks": 6,
  "skills_covered": ["Skill1", "Skill2"],
  "mapped_roles": ["health_data_analyst", "clinical_data_specialist"],
  "prerequisites": ["HC-101"],
  "learning_outcomes": [...]
}
```

Then update role profiles in `roles.json` to reference it.

### Adding a New Role
Edit `knowledge_base/roles.json`:

```json
{
  "role_id": "new_role_id",
  "role_name": "New Role Name",
  "sector": "healthcare_technology",
  "core_responsibilities": [...],
  "core_skills": [...],
  "mapped_course_ids": ["HC-101", "HC-102"],
  "mapped_project_ids": ["HCP-101"]
}
```

---

## 🚨 Common Issues

### Issue: "Role not found"
**Solution**: Check that `target_role` is valid for `target_sector`. Visit `GET /info/roles/{sector}` to list available roles.

### Issue: "No suitable courses or projects found"
**Solution**: The role might not have enough mapped items, or all are marked as completed. Check knowledge base and course_names list.

### Issue: LLM call timeout
**Solution**: Check `OPENAI_API_KEY` is set and valid. System will fallback to rule-based ranking.

### Issue: CORS errors
**Solution**: CORS is enabled for all origins by default. Modify `CORSMiddleware` in `main.py` if needed.

---

## 📈 Performance Notes

- **Cold start**: ~500ms (loading knowledge base)
- **Shortlisting**: ~50ms (rule-based filtering)
- **LLM call**: ~2-5 seconds (network dependent)
- **Total response time**: ~2.5-5.5 seconds

---

## 🔐 Security Considerations

- No sensitive data stored in responses
- User IDs are preserved but not used for anything except response tracking
- Course/project selections are read-only
- All inputs validated with Pydantic
- API key stored in environment variable (not in code)

---

## 📝 Logging

Enable debug logging:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

Check logs for:
- Domain filtering results
- Role-relevance matching
- Shortlisting scores
- LLM prompt/response

---

## 🎯 Future Enhancements (Without ML)

- [ ] User preference learning (store feedback, adjust ranking)
- [ ] Prerequisite chain recommendations
- [ ] Time-based progression (suggest next course after completion)
- [ ] Skill gap analysis (suggest courses for missing skills)
- [ ] Cohort-based recommendations (what others with similar roles took)

---

## 📄 License

Internal project for hackathon. All rights reserved.

---

## 👥 Support

For questions or issues:
1. Check API documentation at `/docs`
2. Review logs for detailed error messages
3. Verify knowledge base files are in `knowledge_base/` directory

---

**Built for the Ingenium Hackathon 2026** ⚡
