package com.hackathon.securestarter.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO for Project Recommendations.
 * Provides personalized project ideas based on skills and career goals.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectRecommendationResponse {

    private String targetJobRole;
    private String industrySector;
    private List<RecommendedProject> recommendedProjects;
    private Integer totalRecommendations;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RecommendedProject {
        private String projectTitle;
        private String description;
        private String skillsToApply; // Skills user already has that apply
        private String skillsToLearn; // New skills user will learn
        private Integer suggestedComplexity; // 1-3
        private String complexityDescription; // Beginner, Intermediate, Advanced
        private String estimatedDuration;
        private String industrySector;
        private String potentialImpact; // How this helps career goals
        private List<String> keyFeatures; // Features to implement
        private List<String> technologiesToUse;
    }
}
