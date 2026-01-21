import pickle

feature_order = [
 'education_level', 'field_of_study', 'percentage',
 'has_ehr', 'has_hl7_fhir', 'has_medical_imaging',
 'has_healthcare_security', 'has_telemedicine',
 'has_iot_sensors', 'has_drone_ops', 'has_precision_ag',
 'has_crop_modeling', 'has_soil_analysis',
 'has_gis', 'has_smart_grid', 'has_traffic_mgmt',
 'has_urban_iot', 'has_building_auto',
 'num_courses', 'avg_course_grade',
 'num_projects', 'avg_project_complexity',
 'num_certifications',
 'has_communication', 'has_teamwork',
 'has_problem_solving', 'has_leadership',
 'target_sector', 'target_role',
 'total_skills', 'avg_performance',
 'skill_project_ratio',
 'healthcare_skills', 'agri_skills',
 'urban_skills', 'soft_skills'
]

pickle.dump(feature_order, open("feature_order.pkl", "wb"))
