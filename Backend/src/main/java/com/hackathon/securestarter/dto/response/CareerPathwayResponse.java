package com.hackathon.securestarter.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO for Career Pathway.
 * Provides a roadmap for career progression.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CareerPathwayResponse {

    private String currentLevel;
    private String targetJobRole;
    private String industrySector;
    private Integer estimatedTimeToReady; // In months
    private List<CareerMilestone> milestones;
    private List<String> keyActions;
    private String summary;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CareerMilestone {
        private Integer order;
        private String milestoneName;
        private String description;
        private List<String> skillsRequired;
        private List<String> suggestedCourses;
        private List<String> suggestedProjects;
        private String estimatedDuration;
        private Boolean isCompleted;
    }
}
