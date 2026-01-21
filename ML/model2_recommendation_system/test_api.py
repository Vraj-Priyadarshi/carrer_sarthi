"""
Sample test requests for the recommendation system.

Run the API first:
    python main.py

Then test with:
    python test_api.py
"""

import requests
import json
from typing import Dict, Any

# API endpoint
BASE_URL = "http://localhost:8000"
RECOMMENDATIONS_ENDPOINT = f"{BASE_URL}/recommendations"


def print_response(response: requests.Response):
    """Pretty print API response."""
    print(f"\n{'='*80}")
    print(f"Status: {response.status_code}")
    print(f"{'='*80}")
    try:
        data = response.json()
        print(json.dumps(data, indent=2))
    except:
        print(response.text)


def test_healthcare_health_data_analyst():
    """Test: Healthcare sector, Health Data Analyst role."""
    
    payload = {
        "user_id": "hca_user_001",
        "education_level": "bachelors",
        "field_of_study": "Computer Science",
        "percentage": 88.0,
        
        # Healthcare skills
        "has_ehr": True,
        "has_hl7_fhir": False,
        "has_medical_imaging": False,
        "has_healthcare_security": False,
        "has_telemedicine": False,
        
        # Agriculture skills
        "has_iot_sensors": False,
        "has_drone_ops": False,
        "has_precision_ag": False,
        "has_crop_modeling": False,
        "has_soil_analysis": False,
        
        # Urban skills
        "has_gis": False,
        "has_smart_grid": False,
        "has_traffic_mgmt": False,
        "has_urban_iot": False,
        "has_building_auto": False,
        
        # Experience
        "num_courses": 2,
        "avg_course_grade": 85.0,
        "courses_names": [],
        "num_projects": 1,
        "avg_project_complexity": "Medium",
        "num_certifications": 0,
        "certification_names": [],
        
        # Soft skills
        "has_communication": True,
        "has_teamwork": True,
        "has_problem_solving": True,
        "has_leadership": False,
        
        # Target role
        "target_sector": "healthcare_technology",
        "target_role": "health_data_analyst",
    }
    
    print("\n" + "="*80)
    print("TEST 1: Healthcare - Health Data Analyst")
    print("="*80)
    print("Request payload:")
    print(json.dumps(payload, indent=2))
    
    response = requests.post(RECOMMENDATIONS_ENDPOINT, json=payload)
    print_response(response)


def test_agriculture_iot_specialist():
    """Test: Agriculture sector, Agricultural IoT Specialist role."""
    
    payload = {
        "user_id": "agiot_user_002",
        "education_level": "bachelors",
        "field_of_study": "Electronics Engineering",
        "percentage": 82.0,
        
        # Healthcare skills
        "has_ehr": False,
        "has_hl7_fhir": False,
        "has_medical_imaging": False,
        "has_healthcare_security": False,
        "has_telemedicine": False,
        
        # Agriculture skills
        "has_iot_sensors": True,
        "has_drone_ops": False,
        "has_precision_ag": True,
        "has_crop_modeling": False,
        "has_soil_analysis": False,
        
        # Urban skills
        "has_gis": False,
        "has_smart_grid": False,
        "has_traffic_mgmt": False,
        "has_urban_iot": False,
        "has_building_auto": False,
        
        # Experience
        "num_courses": 3,
        "avg_course_grade": 83.0,
        "courses_names": ["AG-101", "AG-102"],
        "num_projects": 2,
        "avg_project_complexity": "High",
        "num_certifications": 1,
        "certification_names": ["IoT Fundamentals"],
        
        # Soft skills
        "has_communication": True,
        "has_teamwork": True,
        "has_problem_solving": True,
        "has_leadership": True,
        
        # Target role
        "target_sector": "agricultural_sciences",
        "target_role": "agricultural_iot_specialist",
    }
    
    print("\n" + "="*80)
    print("TEST 2: Agriculture - Agricultural IoT Specialist")
    print("="*80)
    print("Request payload:")
    print(json.dumps(payload, indent=2))
    
    response = requests.post(RECOMMENDATIONS_ENDPOINT, json=payload)
    print_response(response)


def test_smart_city_urban_data_analyst():
    """Test: Smart City sector, Urban Data Analyst role."""
    
    payload = {
        "user_id": "scda_user_003",
        "education_level": "masters",
        "field_of_study": "Data Science",
        "percentage": 91.0,
        
        # Healthcare skills
        "has_ehr": False,
        "has_hl7_fhir": False,
        "has_medical_imaging": False,
        "has_healthcare_security": False,
        "has_telemedicine": False,
        
        # Agriculture skills
        "has_iot_sensors": False,
        "has_drone_ops": False,
        "has_precision_ag": False,
        "has_crop_modeling": False,
        "has_soil_analysis": False,
        
        # Urban skills
        "has_gis": True,
        "has_smart_grid": False,
        "has_traffic_mgmt": True,
        "has_urban_iot": True,
        "has_building_auto": False,
        
        # Experience
        "num_courses": 5,
        "avg_course_grade": 89.0,
        "courses_names": [],
        "num_projects": 3,
        "avg_project_complexity": "High",
        "num_certifications": 2,
        "certification_names": ["GIS Advanced", "Data Analytics Pro"],
        
        # Soft skills
        "has_communication": True,
        "has_teamwork": True,
        "has_problem_solving": True,
        "has_leadership": True,
        
        # Target role
        "target_sector": "urban_smart_city",
        "target_role": "urban_data_analyst",
    }
    
    print("\n" + "="*80)
    print("TEST 3: Smart City - Urban Data Analyst")
    print("="*80)
    print("Request payload:")
    print(json.dumps(payload, indent=2))
    
    response = requests.post(RECOMMENDATIONS_ENDPOINT, json=payload)
    print_response(response)


def test_sectors_endpoint():
    """Test: List all sectors."""
    
    print("\n" + "="*80)
    print("TEST: GET /info/sectors")
    print("="*80)
    
    response = requests.get(f"{BASE_URL}/info/sectors")
    print_response(response)


def test_roles_endpoint():
    """Test: List roles for a sector."""
    
    print("\n" + "="*80)
    print("TEST: GET /info/roles/healthcare_technology")
    print("="*80)
    
    response = requests.get(f"{BASE_URL}/info/roles/healthcare_technology")
    print_response(response)


def test_health_endpoint():
    """Test: Health check."""
    
    print("\n" + "="*80)
    print("TEST: GET /health")
    print("="*80)
    
    response = requests.get(f"{BASE_URL}/health")
    print_response(response)


def main():
    """Run all tests."""
    
    print("\n" + "#"*80)
    print("# RECOMMENDATION SYSTEM - API TESTS")
    print("#"*80)
    
    try:
        # Test endpoints
        test_health_endpoint()
        test_sectors_endpoint()
        test_roles_endpoint()
        
        # Test recommendation endpoint
        test_healthcare_health_data_analyst()
        test_agriculture_iot_specialist()
        test_smart_city_urban_data_analyst()
        
        print("\n" + "#"*80)
        print("# ALL TESTS COMPLETED")
        print("#"*80)
        
    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: Could not connect to API at {BASE_URL}")
        print("Make sure the server is running:")
        print("    python main.py")
    except Exception as e:
        print(f"\n❌ ERROR: {e}")


if __name__ == "__main__":
    main()
