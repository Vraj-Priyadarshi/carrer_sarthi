from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import pickle

# =====================================================
# Load Models
# =====================================================
gap_model = pickle.load(open("models/skill_gap_model.pkl", "rb"))
time_model = pickle.load(open("models/time_model.pkl", "rb"))
skill_model = pickle.load(open("models/skill_classifier.pkl", "rb"))
scaler = pickle.load(open("models/scaler.pkl", "rb"))
label_encoders = pickle.load(open("models/label_encoders.pkl", "rb"))
feature_order = pickle.load(open("models/feature_order.pkl", "rb"))

skill_le = label_encoders["top_missing_skill"]

# =====================================================
# FastAPI App
# =====================================================
app = FastAPI(
    title="Skill Intelligence API",
    description="Predict skill gap, time to readiness, and missing skills",
    version="1.0.0"
)

# =====================================================
# Input Schema
# =====================================================
class SkillInput(BaseModel):
    education_level: int
    field_of_study: int
    percentage: float

    has_ehr: int
    has_hl7_fhir: int
    has_medical_imaging: int
    has_healthcare_security: int
    has_telemedicine: int

    has_iot_sensors: int
    has_drone_ops: int
    has_precision_ag: int
    has_crop_modeling: int
    has_soil_analysis: int

    has_gis: int
    has_smart_grid: int
    has_traffic_mgmt: int
    has_urban_iot: int
    has_building_auto: int

    num_courses: int
    avg_course_grade: float
    num_projects: int
    avg_project_complexity: float
    num_certifications: int

    has_communication: int
    has_teamwork: int
    has_problem_solving: int
    has_leadership: int

    target_sector: int
    target_role: int

# =====================================================
# Helper: Feature Engineering
# =====================================================
def engineer_features(data: SkillInput):
    raw = data.dict()

    # Derived features
    raw["total_skills"] = (
        raw["num_courses"] +
        raw["num_certifications"] +
        raw["num_projects"]
    )

    raw["avg_performance"] = (
        raw["percentage"] +
        raw["avg_course_grade"]
    ) / 2

    raw["skill_project_ratio"] = (
        raw["num_certifications"] /
        (raw["num_projects"] + 1)
    )

    raw["healthcare_skills"] = (
        raw["has_ehr"] +
        raw["has_hl7_fhir"] +
        raw["has_medical_imaging"] +
        raw["has_healthcare_security"] +
        raw["has_telemedicine"]
    )

    raw["agri_skills"] = (
        raw["has_iot_sensors"] +
        raw["has_drone_ops"] +
        raw["has_precision_ag"] +
        raw["has_crop_modeling"] +
        raw["has_soil_analysis"]
    )

    raw["urban_skills"] = (
        raw["has_gis"] +
        raw["has_smart_grid"] +
        raw["has_traffic_mgmt"] +
        raw["has_urban_iot"] +
        raw["has_building_auto"]
    )

    raw["soft_skills"] = (
        raw["has_communication"] +
        raw["has_teamwork"] +
        raw["has_problem_solving"] +
        raw["has_leadership"]
    )

    # EXACT ORDER MATCH
    X = [raw[col] for col in feature_order]

    return np.array(X).reshape(1, -1)

# =====================================================
# API: Predict Skill Intelligence
# =====================================================
@app.post("/skillPredict")
def predict(data: SkillInput):
    X = engineer_features(data)
    X_scaled = scaler.transform(X)

    gap = float(gap_model.predict(X_scaled)[0])
    time = float(time_model.predict(X_scaled)[0])

    probs = skill_model.predict_proba(X_scaled)[0]
    top_idx = np.argsort(probs)[-3:][::-1]

    skills = [
        {
            "skill": skill_le.inverse_transform([i])[0],
            "confidence": round(probs[i] * 100, 2)
        }
        for i in top_idx
    ]

    return {
        "skill_gap_score": round(gap, 2),
        "time_to_ready_months": round(time, 2),
        "recommended_skills": skills,
        "status": (
            "Ready" if gap < 10 else
            "Almost Ready" if gap < 25 else
            "Needs Improvement"
        )
    }


# =====================================================
# Health Check
# =====================================================
@app.get("/")
def health():
    return {"status": "Skill Intelligence API running 🚀"}
