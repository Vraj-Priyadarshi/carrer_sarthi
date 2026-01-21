package com.hackathon.securestarter.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Request DTO for ML Recommendation API (localhost:8000/recommendations)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MLRecommendationRequest {

    @JsonProperty("user_id")
    private String userId;

    @JsonProperty("education_level")
    private String educationLevel;

    @JsonProperty("field_of_study")
    private String fieldOfStudy;

    @JsonProperty("percentage")
    private Double percentage;

    // Healthcare Technology Skills
    @JsonProperty("has_ehr")
    private Boolean hasEhr;

    @JsonProperty("has_hl7_fhir")
    private Boolean hasHl7Fhir;

    @JsonProperty("has_medical_imaging")
    private Boolean hasMedicalImaging;

    @JsonProperty("has_healthcare_security")
    private Boolean hasHealthcareSecurity;

    @JsonProperty("has_telemedicine")
    private Boolean hasTelemedicine;

    // Agricultural Technology Skills
    @JsonProperty("has_iot_sensors")
    private Boolean hasIotSensors;

    @JsonProperty("has_drone_ops")
    private Boolean hasDroneOps;

    @JsonProperty("has_precision_ag")
    private Boolean hasPrecisionAg;

    @JsonProperty("has_crop_modeling")
    private Boolean hasCropModeling;

    @JsonProperty("has_soil_analysis")
    private Boolean hasSoilAnalysis;

    // Smart City & Urban Systems Skills
    @JsonProperty("has_gis")
    private Boolean hasGis;

    @JsonProperty("has_smart_grid")
    private Boolean hasSmartGrid;

    @JsonProperty("has_traffic_mgmt")
    private Boolean hasTrafficMgmt;

    @JsonProperty("has_urban_iot")
    private Boolean hasUrbanIot;

    @JsonProperty("has_building_auto")
    private Boolean hasBuildingAuto;

    // Course and Project Information
    @JsonProperty("num_courses")
    private Integer numCourses;

    @JsonProperty("avg_course_grade")
    private Double avgCourseGrade;

    @JsonProperty("courses_names")
    private List<String> coursesNames;

    @JsonProperty("num_projects")
    private Integer numProjects;

    @JsonProperty("avg_project_complexity")
    private String avgProjectComplexity;

    // Certifications
    @JsonProperty("num_certifications")
    private Integer numCertifications;

    @JsonProperty("certification_names")
    private List<String> certificationNames;

    // Soft Skills
    @JsonProperty("has_communication")
    private Boolean hasCommunication;

    @JsonProperty("has_teamwork")
    private Boolean hasTeamwork;

    @JsonProperty("has_problem_solving")
    private Boolean hasProblemSolving;

    @JsonProperty("has_leadership")
    private Boolean hasLeadership;

    // Target Career Information
    @JsonProperty("target_sector")
    private String targetSector;

    @JsonProperty("target_role")
    private String targetRole;
}
