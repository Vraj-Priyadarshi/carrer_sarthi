"""
Configuration and constants for the recommendation system.
"""

from enum import Enum
from typing import Dict, List

# ==================== EDUCATION LEVEL ENUM ====================
class EducationLevel(str, Enum):
    HIGH_SCHOOL = "high_school"
    BACHELORS = "bachelors"
    MASTERS = "masters"
    PHD = "phd"
    DIPLOMA = "diploma"


# ==================== SECTOR ENUM ====================
class Sector(str, Enum):
    HEALTHCARE_TECHNOLOGY = "healthcare_technology"
    AGRICULTURAL_SCIENCES = "agricultural_sciences"
    URBAN_SMART_CITY = "urban_smart_city"


# ==================== DIFFICULTY LEVEL ENUM ====================
class DifficultyLevel(str, Enum):
    BEGINNER = "Beginner"
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced"


# ==================== SKILL MAPPINGS ====================
HEALTHCARE_SKILLS = {
    "ehr": ["Healthcare Data Types", "EHR Systems"],
    "hl7_fhir": ["HL7 Protocol", "FHIR Standards"],
    "medical_imaging": ["Medical Imaging", "DICOM Standard"],
    "healthcare_security": ["Data Encryption", "Access Control"],
    "telemedicine": ["Real-time Communication", "Telemedicine Platforms"],
}

AGRICULTURE_SKILLS = {
    "iot_sensors": ["IoT Sensors", "Sensor Networks"],
    "drone_ops": ["Drone Operations", "Autonomous Systems"],
    "precision_ag": ["Precision Farming", "Variable Rate Technology"],
    "crop_modeling": ["Crop Science", "Predictive Modeling"],
    "soil_analysis": ["Soil Sampling", "Soil Properties"],
}

URBAN_SKILLS = {
    "gis": ["GIS", "Spatial Analysis"],
    "smart_grid": ["Smart Grid Technology", "Power Systems"],
    "traffic_mgmt": ["Traffic Engineering", "Optimization"],
    "urban_iot": ["IoT Systems", "Sensor Networks"],
    "building_auto": ["Building Automation", "Smart Systems"],
}

# ==================== ROLE TO DOMAIN MAPPING ====================
ROLE_DOMAIN_MAPPING = {
    # Healthcare roles
    "health_data_analyst": "healthcare_technology",
    "clinical_informatics_specialist": "healthcare_technology",
    "healthcare_ml_engineer": "healthcare_technology",
    "medical_imaging_specialist": "healthcare_technology",
    "telemedicine_systems_engineer": "healthcare_technology",
    "healthcare_security_analyst": "healthcare_technology",
    "clinical_data_specialist": "healthcare_technology",
    "population_health_analyst": "healthcare_technology",
    "healthcare_it_manager": "healthcare_technology",
    "other_healthcare_role": "healthcare_technology",
    # Agriculture roles
    "precision_agriculture_specialist": "agricultural_sciences",
    "agricultural_data_scientist": "agricultural_sciences",
    "farm_automation_engineer": "agricultural_sciences",
    "agritech_product_manager": "agricultural_sciences",
    "crop_analytics_specialist": "agricultural_sciences",
    "agricultural_iot_specialist": "agricultural_sciences",
    "smart_irrigation_engineer": "agricultural_sciences",
    "agricultural_robotics_engineer": "agricultural_sciences",
    "soil_health_data_analyst": "agricultural_sciences",
    "other_agriculture_role": "agricultural_sciences",
    # Smart City roles
    "smart_city_solutions_architect": "urban_smart_city",
    "urban_data_analyst": "urban_smart_city",
    "iot_infrastructure_engineer": "urban_smart_city",
    "traffic_management_systems_engineer": "urban_smart_city",
    "sustainability_analytics_specialist": "urban_smart_city",
    "gis_spatial_analysis_specialist": "urban_smart_city",
    "smart_city_data_architect": "urban_smart_city",
    "urban_iot_developer": "urban_smart_city",
    "energy_systems_engineer": "urban_smart_city",
    "other_smart_city_role": "urban_smart_city",
}

# ==================== EDUCATION LEVEL TO DIFFICULTY MAPPING ====================
EDUCATION_TO_DIFFICULTY = {
    "high_school": ["Beginner", "Intermediate"],
    "diploma": ["Beginner", "Intermediate"],
    "bachelors": ["Intermediate", "Advanced"],
    "masters": ["Advanced"],
    "phd": ["Advanced"],
}

# ==================== SOFT SKILLS MAPPING ====================
SOFT_SKILLS = ["communication", "teamwork", "problem_solving", "leadership"]

# ==================== LLM CONSTANTS ====================
LLM_MODEL = "gpt-4"  # or claude-3-sonnet, depending on your setup
LLM_TEMPERATURE = 0.7
LLM_MAX_TOKENS = 2000

# ==================== RECOMMENDATION CONSTANTS ====================
RECOMMENDED_COURSES_COUNT = 3
RECOMMENDED_PROJECTS_COUNT = 2
MAX_COURSES_TO_SHORTLIST = 10
MAX_PROJECTS_TO_SHORTLIST = 5

# ==================== KNOWLEDGE BASE PATHS ====================
ROLES_JSON_PATH = "knowledge_base/roles.json"
COURSES_JSON_PATH = "knowledge_base/courses.json"
PROJECTS_JSON_PATH = "knowledge_base/projects.json"

# ==================== ROLE WEIGHTS FOR SCORING ====================
ROLE_RELEVANCE_WEIGHT = 0.50
DIFFICULTY_MATCH_WEIGHT = 0.25
SKILL_COVERAGE_WEIGHT = 0.15
EXPERIENCE_WEIGHT = 0.10

# ==================== DIFFICULTY SCORE MAPPING ====================
DIFFICULTY_SCORES = {
    "Beginner": 1,
    "Intermediate": 2,
    "Advanced": 3,
}

# ==================== COMPLEXITY SCORE MAPPING ====================
COMPLEXITY_SCORES = {
    "Low": 1,
    "Medium": 2,
    "High": 3,
}
