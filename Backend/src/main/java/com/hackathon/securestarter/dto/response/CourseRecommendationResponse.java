package com.hackathon.securestarter.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO for Course Recommendations.
 * Provides personalized course suggestions based on skill gaps and career goals.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseRecommendationResponse {

    private String targetJobRole;
    private String industrySector;
    private List<RecommendedCourse> recommendedCourses;
    private Integer totalRecommendations;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RecommendedCourse {
        private String courseName;
        private String description;
        private String skillsCovered;
        private String platform; // Coursera, Udemy, edX, etc.
        private String difficulty; // Beginner, Intermediate, Advanced
        private String estimatedDuration;
        private String priority; // High, Medium, Low
        private String reason; // Why this course is recommended
    }
}
