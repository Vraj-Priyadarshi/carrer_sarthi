package com.hackathon.securestarter.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Response DTO for Skill Profile data.
 * Includes skill counts by category.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillProfileResponse {

    private UUID id;

    // Healthcare Technology Skills
    private Boolean hasEhr;
    private Boolean hasHl7Fhir;
    private Boolean hasMedicalImaging;
    private Boolean hasHealthcareSecurity;
    private Boolean hasTelemedicine;

    // Agricultural Technology Skills
    private Boolean hasIotSensors;
    private Boolean hasDroneOps;
    private Boolean hasPrecisionAg;
    private Boolean hasCropModeling;
    private Boolean hasSoilAnalysis;

    // Smart City & Urban Systems Skills
    private Boolean hasGis;
    private Boolean hasSmartGrid;
    private Boolean hasTrafficMgmt;
    private Boolean hasUrbanIot;
    private Boolean hasBuildingAuto;

    // Professional Soft Skills
    private Boolean hasCommunication;
    private Boolean hasTeamwork;
    private Boolean hasProblemSolving;
    private Boolean hasLeadership;

    // Computed counts
    private Integer healthcareSkillsCount;
    private Integer agricultureSkillsCount;
    private Integer urbanSkillsCount;
    private Integer softSkillsCount;
    private Integer totalSkillsCount;

    private LocalDateTime updatedAt;
    private LocalDateTime createdAt;
}
