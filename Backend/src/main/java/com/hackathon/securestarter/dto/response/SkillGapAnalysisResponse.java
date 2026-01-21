package com.hackathon.securestarter.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO for Skill Gap Analysis.
 * Identifies missing skills and provides readiness assessment for target role.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillGapAnalysisResponse {

    private String targetJobRole;
    private String industrySector;
    
    // Skills User Has
    private List<String> currentSkills;
    private Integer currentSkillsCount;
    
    // Required Skills for Target Role
    private List<String> requiredSkills;
    private Integer requiredSkillsCount;
    
    // Skills User is Missing
    private List<String> missingSkills;
    private Integer missingSkillsCount;
    
    // Readiness Assessment
    private Double skillMatchPercentage; // 0-100
    private String readinessAssessment; // "Not Ready", "Partially Ready", "Mostly Ready", "Fully Ready"
    
    // Priority Skills to Learn
    private List<SkillPriority> prioritySkillsToLearn;

    // Learning Path Recommendations
    private List<String> recommendedLearningPath;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SkillPriority {
        private String skillName;
        private String priority; // "High", "Medium", "Low"
        private String reason;
    }

    /**
     * Calculate readiness assessment based on match percentage
     */
    public static String calculateReadinessAssessment(Double matchPercentage) {
        if (matchPercentage == null || matchPercentage < 25) return "Not Ready";
        if (matchPercentage < 50) return "Partially Ready";
        if (matchPercentage < 75) return "Mostly Ready";
        return "Fully Ready";
    }
}
