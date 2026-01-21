package com.hackathon.securestarter.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for Skill Predict API (localhost:8001/skillPredict)
 * Note: This API uses integer/numeric values for boolean fields
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillPredictRequest {

    @JsonProperty("education_level")
    private Integer educationLevel; // 1=High School, 2=Undergraduate, 3=Postgraduate, 4=PhD

    @JsonProperty("field_of_study")
    private Integer fieldOfStudy; // Encoded field value

    @JsonProperty("percentage")
    private Double percentage;

    // Healthcare Technology Skills (0 or 1)
    @JsonProperty("has_ehr")
    private Integer hasEhr;

    @JsonProperty("has_hl7_fhir")
    private Integer hasHl7Fhir;

    @JsonProperty("has_medical_imaging")
    private Integer hasMedicalImaging;

    @JsonProperty("has_healthcare_security")
    private Integer hasHealthcareSecurity;

    @JsonProperty("has_telemedicine")
    private Integer hasTelemedicine;

    // Agricultural Technology Skills (0 or 1)
    @JsonProperty("has_iot_sensors")
    private Integer hasIotSensors;

    @JsonProperty("has_drone_ops")
    private Integer hasDroneOps;

    @JsonProperty("has_precision_ag")
    private Integer hasPrecisionAg;

    @JsonProperty("has_crop_modeling")
    private Integer hasCropModeling;

    @JsonProperty("has_soil_analysis")
    private Integer hasSoilAnalysis;

    // Smart City & Urban Systems Skills (0 or 1)
    @JsonProperty("has_gis")
    private Integer hasGis;

    @JsonProperty("has_smart_grid")
    private Integer hasSmartGrid;

    @JsonProperty("has_traffic_mgmt")
    private Integer hasTrafficMgmt;

    @JsonProperty("has_urban_iot")
    private Integer hasUrbanIot;

    @JsonProperty("has_building_auto")
    private Integer hasBuildingAuto;

    // Course and Project Information
    @JsonProperty("num_courses")
    private Integer numCourses;

    @JsonProperty("avg_course_grade")
    private Double avgCourseGrade;

    @JsonProperty("num_projects")
    private Integer numProjects;

    @JsonProperty("avg_project_complexity")
    private Double avgProjectComplexity;

    // Certifications
    @JsonProperty("num_certifications")
    private Integer numCertifications;

    // Soft Skills (0 or 1)
    @JsonProperty("has_communication")
    private Integer hasCommunication;

    @JsonProperty("has_teamwork")
    private Integer hasTeamwork;

    @JsonProperty("has_problem_solving")
    private Integer hasProblemSolving;

    @JsonProperty("has_leadership")
    private Integer hasLeadership;

    // Target Career Information (encoded as integers)
    @JsonProperty("target_sector")
    private Integer targetSector;

    @JsonProperty("target_role")
    private Integer targetRole;
}
