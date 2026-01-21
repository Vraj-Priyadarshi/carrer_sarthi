"""
Pydantic models for request and response validation.
"""

from typing import List, Optional
from pydantic import BaseModel, Field, validator


class RecommendationRequest(BaseModel):
    """Incoming request from frontend with user profile and preferences."""
    
    user_id: str = Field(..., description="Unique user identifier")
    education_level: str = Field(..., description="User's education level")
    field_of_study: Optional[str] = Field(None, description="User's field of study")
    percentage: Optional[float] = Field(None, description="Grade percentage or GPA")
    
    # Healthcare skills
    has_ehr: bool = False
    has_hl7_fhir: bool = False
    has_medical_imaging: bool = False
    has_healthcare_security: bool = False
    has_telemedicine: bool = False
    
    # Agriculture skills
    has_iot_sensors: bool = False
    has_drone_ops: bool = False
    has_precision_ag: bool = False
    has_crop_modeling: bool = False
    has_soil_analysis: bool = False
    
    # Urban/Smart City skills
    has_gis: bool = False
    has_smart_grid: bool = False
    has_traffic_mgmt: bool = False
    has_urban_iot: bool = False
    has_building_auto: bool = False
    
    # Course experience
    num_courses: int = Field(0, ge=0, description="Number of completed courses")
    avg_course_grade: Optional[float] = Field(None, description="Average course grade")
    courses_names: List[str] = Field(default_factory=list, description="Names of completed courses")
    
    # Project experience
    num_projects: int = Field(0, ge=0, description="Number of completed projects")
    avg_project_complexity: Optional[str] = Field(None, description="Average project complexity")
    
    # Certifications
    num_certifications: int = Field(0, ge=0, description="Number of certifications")
    certification_names: List[str] = Field(default_factory=list, description="Certification names")
    
    # Soft skills
    has_communication: bool = False
    has_teamwork: bool = False
    has_problem_solving: bool = False
    has_leadership: bool = False
    
    # Target role and sector
    target_sector: str = Field(..., description="Target industry sector")
    target_role: str = Field(..., description="Target job role")
    
    @validator('education_level')
    def validate_education_level(cls, v):
        valid_levels = ['high_school', 'diploma', 'bachelors', 'masters', 'phd', 'undergraduate', 'postgraduate']
        normalized = v.lower().strip()
        # Map common variations
        level_map = {
            'undergraduate': 'bachelors',
            'postgraduate': 'masters',
            'graduate': 'bachelors',
        }
        if normalized in level_map:
            return level_map[normalized]
        if normalized not in valid_levels:
            return 'bachelors'  # Default fallback instead of error
        return normalized
    
    @validator('target_sector')
    def validate_sector(cls, v):
        valid_sectors = ['healthcare_technology', 'agricultural_sciences', 'urban_smart_city']
        normalized = v.lower().strip()
        # Map common variations
        sector_map = {
            'healthcare': 'healthcare_technology',
            'health': 'healthcare_technology',
            'agriculture': 'agricultural_sciences',
            'agri': 'agricultural_sciences',
            'urban': 'urban_smart_city',
            'smart_city': 'urban_smart_city',
            'smart city': 'urban_smart_city',
        }
        if normalized in sector_map:
            return sector_map[normalized]
        if normalized not in valid_sectors:
            return 'healthcare_technology'  # Default fallback instead of error
        return normalized

    @validator('target_role')
    def validate_role(cls, v, values):
        normalized = v.lower().strip().replace(' ', '_')
        
        # Healthcare roles mapping
        healthcare_role_map = {
            'telemedicine_coordinator': 'telemedicine_systems_engineer',
            'telemedicine': 'telemedicine_systems_engineer',
            'telehealth': 'telemedicine_systems_engineer',
            'health_data': 'health_data_analyst',
            'data_analyst': 'health_data_analyst',
            'clinical_informatics': 'clinical_informatics_specialist',
            'informatics': 'clinical_informatics_specialist',
            'ml_engineer': 'healthcare_ml_engineer',
            'machine_learning': 'healthcare_ml_engineer',
            'medical_imaging': 'medical_imaging_specialist',
            'imaging': 'medical_imaging_specialist',
            'security_analyst': 'healthcare_security_analyst',
            'security': 'healthcare_security_analyst',
            'clinical_data': 'clinical_data_specialist',
            'population_health': 'population_health_analyst',
            'it_manager': 'healthcare_it_manager',
            'healthcare_it': 'healthcare_it_manager',
        }
        
        # Agriculture roles mapping
        agriculture_role_map = {
            'precision_agriculture': 'precision_agriculture_specialist',
            'precision_ag': 'precision_agriculture_specialist',
            'crop_scientist': 'crop_data_scientist',
            'crop_data': 'crop_data_scientist',
            'drone_operator': 'agricultural_drone_operator',
            'drone': 'agricultural_drone_operator',
            'iot_specialist': 'farm_iot_specialist',
            'iot': 'farm_iot_specialist',
            'soil_analyst': 'soil_analysis_specialist',
            'soil': 'soil_analysis_specialist',
        }
        
        # Urban roles mapping
        urban_role_map = {
            'smart_grid': 'smart_grid_analyst',
            'grid_analyst': 'smart_grid_analyst',
            'traffic_engineer': 'traffic_systems_engineer',
            'traffic': 'traffic_systems_engineer',
            'urban_iot': 'urban_iot_specialist',
            'building_automation': 'building_automation_engineer',
            'building': 'building_automation_engineer',
            'gis_analyst': 'gis_specialist',
            'gis': 'gis_specialist',
        }
        
        # Combined mapping
        all_role_maps = {**healthcare_role_map, **agriculture_role_map, **urban_role_map}
        
        if normalized in all_role_maps:
            return all_role_maps[normalized]
        
        # If role name is already a valid role ID, return it
        valid_healthcare_roles = ['health_data_analyst', 'clinical_informatics_specialist', 'healthcare_ml_engineer',
                                   'medical_imaging_specialist', 'telemedicine_systems_engineer', 'healthcare_security_analyst',
                                   'clinical_data_specialist', 'population_health_analyst', 'healthcare_it_manager', 'other_healthcare_role']
        valid_agriculture_roles = ['precision_agriculture_specialist', 'crop_data_scientist', 'agricultural_drone_operator',
                                    'farm_iot_specialist', 'soil_analysis_specialist', 'agricultural_systems_engineer', 'other_agriculture_role']
        valid_urban_roles = ['smart_grid_analyst', 'traffic_systems_engineer', 'urban_iot_specialist',
                             'building_automation_engineer', 'gis_specialist', 'urban_data_analyst', 'other_urban_role']
        
        all_valid_roles = valid_healthcare_roles + valid_agriculture_roles + valid_urban_roles
        
        if normalized in all_valid_roles:
            return normalized
        
        # Default fallback based on sector
        sector = values.get('target_sector', 'healthcare_technology')
        if sector == 'healthcare_technology':
            return 'other_healthcare_role'
        elif sector == 'agricultural_sciences':
            return 'other_agriculture_role'
        else:
            return 'other_urban_role'


class CourseRecommendation(BaseModel):
    """Recommended course with explanation."""
    
    course_id: str
    title: str
    domain: str
    difficulty: str
    duration_weeks: int
    skills_covered: List[str]
    explanation: str


class ProjectRecommendation(BaseModel):
    """Recommended project with explanation."""
    
    project_id: str
    title: str
    domain: str
    difficulty: str
    complexity: str
    duration_weeks: int
    skills_required: List[str]
    explanation: str


class RecommendationResponse(BaseModel):
    """Final recommendation response with courses and projects."""
    
    user_id: str
    target_role: str
    target_sector: str
    recommended_courses: List[CourseRecommendation]
    recommended_projects: List[ProjectRecommendation]
    reasoning: str
    generated_at: str


class ErrorResponse(BaseModel):
    """Error response model."""
    
    error: str
    details: Optional[str] = None
    user_id: Optional[str] = None
