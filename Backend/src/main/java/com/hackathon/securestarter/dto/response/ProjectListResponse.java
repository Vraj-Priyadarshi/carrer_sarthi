package com.hackathon.securestarter.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO for Project list with statistics.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectListResponse {

    private List<ProjectResponse> projects;
    private Integer totalProjects;
    private Double averageComplexity;
    private Integer beginnerProjects;    // Complexity = 1
    private Integer intermediateProjects; // Complexity = 2
    private Integer advancedProjects;     // Complexity = 3
    private String experienceLevel; // Based on average complexity

    /**
     * Calculate experience level based on average complexity
     */
    public static String calculateExperienceLevel(Double avgComplexity) {
        if (avgComplexity == null || avgComplexity == 0) return "No Projects";
        if (avgComplexity >= 2.5) return "Advanced";
        if (avgComplexity >= 1.5) return "Intermediate";
        return "Beginner";
    }
}
