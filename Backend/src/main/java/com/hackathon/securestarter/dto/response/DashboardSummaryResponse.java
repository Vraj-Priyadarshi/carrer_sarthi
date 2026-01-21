package com.hackathon.securestarter.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Comprehensive Dashboard Summary Response DTO.
 * Aggregates data from all user profiles for dashboard display.
 * Includes external API data from ML services.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardSummaryResponse {

    // User Info
    private String firstName;
    private String lastName;
    private String email;
    private Boolean onboardingCompleted;
    private LocalDateTime onboardingCompletedAt;

    // Academic Summary
    private AcademicSummary academicSummary;

    // Career Summary
    private CareerSummary careerSummary;

    // Skills Summary
    private SkillsSummary skillsSummary;

    // Skill Profile Detail - Individual skills for UI display
    private SkillProfileDetail skillProfile;

    // Learning Progress Summary
    private LearningProgressSummary learningProgress;

    // Readiness Score (0-100)
    private Integer overallReadinessScore;
    private String readinessLevel; // "Beginner", "Intermediate", "Job Ready", "Expert"

    // External API Data (ML Recommendations & Skill Predictions)
    private ExternalApiResponse externalApiData;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AcademicSummary {
        private String educationLevel;
        private Float cgpaPercentage;
        private String fieldOfStudy;
        private String institution;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CareerSummary {
        private String industrySector;
        private String targetJobRole;
        private String careerGoals;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SkillsSummary {
        private Integer totalSkillsCount;
        private Integer healthcareSkillsCount;
        private Integer agricultureSkillsCount;
        private Integer urbanSkillsCount;
        private Integer softSkillsCount;
        private Integer relevantSkillsForSector; // Skills matching target industry
    }

    // Skill Profile Detail - Individual skill booleans for UI display
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SkillProfileDetail {
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
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LearningProgressSummary {
        private Integer totalCourses;
        private Double averageGrade;
        private String coursePerformanceLevel;
        private Integer totalProjects;
        private Double averageComplexity;
        private String projectExperienceLevel;
        private Integer totalCertifications;
        private Integer activeCertifications;
    }

    /**
     * Calculate readiness level based on score
     */
    public static String calculateReadinessLevel(Integer score) {
        if (score == null || score < 25) return "Beginner";
        if (score < 50) return "Intermediate";
        if (score < 75) return "Job Ready";
        return "Expert";
    }
}
