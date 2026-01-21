package com.hackathon.securestarter.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Response DTO for a single Project.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectResponse {

    private UUID id;
    private String projectTitle;
    private String domainSkills;
    private Integer complexityLevel;
    private String complexityDescription; // "Beginner", "Intermediate", "Advanced"
    private String description;
    private String githubUrl;
    private String demoUrl;
    private LocalDateTime updatedAt;
    private LocalDateTime createdAt;

    /**
     * Get complexity level description from numeric value
     */
    public static String getComplexityDescription(Integer level) {
        return switch (level) {
            case 1 -> "Beginner";
            case 2 -> "Intermediate";
            case 3 -> "Advanced";
            default -> "Unknown";
        };
    }
}
