package com.hackathon.securestarter.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Response DTO for Academic Profile data.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AcademicProfileResponse {

    private UUID id;
    private Integer educationLevel;
    private String educationLevelDescription; // "High School", "Undergraduate", etc.
    private Float cgpaPercentage;
    private String fieldOfStudy;
    private String institution;
    private LocalDateTime updatedAt;
    private LocalDateTime createdAt;

    /**
     * Get education level description from numeric value
     */
    public static String getEducationLevelDescription(Integer level) {
        return switch (level) {
            case 1 -> "High School";
            case 2 -> "Undergraduate";
            case 3 -> "Postgraduate";
            case 4 -> "PhD";
            default -> "Unknown";
        };
    }
}
