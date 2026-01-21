package com.hackathon.securestarter.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "skill_profiles", indexes = {
        @Index(name = "idx_skill_user_id", columnList = "user_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // Healthcare Technology Skills
    @Column(name = "has_ehr", nullable = false)
    @Builder.Default
    private Boolean hasEhr = false;

    @Column(name = "has_hl7_fhir", nullable = false)
    @Builder.Default
    private Boolean hasHl7Fhir = false;

    @Column(name = "has_medical_imaging", nullable = false)
    @Builder.Default
    private Boolean hasMedicalImaging = false;

    @Column(name = "has_healthcare_security", nullable = false)
    @Builder.Default
    private Boolean hasHealthcareSecurity = false;

    @Column(name = "has_telemedicine", nullable = false)
    @Builder.Default
    private Boolean hasTelemedicine = false;

    // Agricultural Technology Skills
    @Column(name = "has_iot_sensors", nullable = false)
    @Builder.Default
    private Boolean hasIotSensors = false;

    @Column(name = "has_drone_ops", nullable = false)
    @Builder.Default
    private Boolean hasDroneOps = false;

    @Column(name = "has_precision_ag", nullable = false)
    @Builder.Default
    private Boolean hasPrecisionAg = false;

    @Column(name = "has_crop_modeling", nullable = false)
    @Builder.Default
    private Boolean hasCropModeling = false;

    @Column(name = "has_soil_analysis", nullable = false)
    @Builder.Default
    private Boolean hasSoilAnalysis = false;

    // Smart City & Urban Systems Skills
    @Column(name = "has_gis", nullable = false)
    @Builder.Default
    private Boolean hasGis = false;

    @Column(name = "has_smart_grid", nullable = false)
    @Builder.Default
    private Boolean hasSmartGrid = false;

    @Column(name = "has_traffic_mgmt", nullable = false)
    @Builder.Default
    private Boolean hasTrafficMgmt = false;

    @Column(name = "has_urban_iot", nullable = false)
    @Builder.Default
    private Boolean hasUrbanIot = false;

    @Column(name = "has_building_auto", nullable = false)
    @Builder.Default
    private Boolean hasBuildingAuto = false;

    // Professional Soft Skills
    @Column(name = "has_communication", nullable = false)
    @Builder.Default
    private Boolean hasCommunication = false;

    @Column(name = "has_teamwork", nullable = false)
    @Builder.Default
    private Boolean hasTeamwork = false;

    @Column(name = "has_problem_solving", nullable = false)
    @Builder.Default
    private Boolean hasProblemSolving = false;

    @Column(name = "has_leadership", nullable = false)
    @Builder.Default
    private Boolean hasLeadership = false;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}