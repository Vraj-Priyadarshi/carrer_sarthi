package com.hackathon.securestarter.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Skill Profile creation/update requests.
 * All skills default to false if not provided.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillProfileRequest {

    // Healthcare Technology Skills
    @Builder.Default
    private Boolean hasEhr = false; // Electronic Health Records

    @Builder.Default
    private Boolean hasHl7Fhir = false; // HL7/FHIR Standards

    @Builder.Default
    private Boolean hasMedicalImaging = false;

    @Builder.Default
    private Boolean hasHealthcareSecurity = false; // HIPAA Compliance

    @Builder.Default
    private Boolean hasTelemedicine = false;

    // Agricultural Technology Skills
    @Builder.Default
    private Boolean hasIotSensors = false;

    @Builder.Default
    private Boolean hasDroneOps = false; // Drone Operations

    @Builder.Default
    private Boolean hasPrecisionAg = false; // Precision Agriculture

    @Builder.Default
    private Boolean hasCropModeling = false;

    @Builder.Default
    private Boolean hasSoilAnalysis = false;

    // Smart City & Urban Systems Skills
    @Builder.Default
    private Boolean hasGis = false; // Geographic Information Systems

    @Builder.Default
    private Boolean hasSmartGrid = false;

    @Builder.Default
    private Boolean hasTrafficMgmt = false; // Traffic Management

    @Builder.Default
    private Boolean hasUrbanIot = false;

    @Builder.Default
    private Boolean hasBuildingAuto = false; // Building Automation

    // Professional Soft Skills
    @Builder.Default
    private Boolean hasCommunication = false;

    @Builder.Default
    private Boolean hasTeamwork = false;

    @Builder.Default
    private Boolean hasProblemSolving = false;

    @Builder.Default
    private Boolean hasLeadership = false;
}
