package com.hackathon.securestarter.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO for ML Recommendation API (localhost:8000/recommendations)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MLRecommendationResponse {

    @JsonProperty("user_id")
    private String userId;

    @JsonProperty("target_role")
    private String targetRole;

    @JsonProperty("target_sector")
    private String targetSector;

    @JsonProperty("recommended_courses")
    private List<RecommendedCourse> recommendedCourses;

    @JsonProperty("recommended_projects")
    private List<RecommendedProject> recommendedProjects;

    @JsonProperty("reasoning")
    private String reasoning;

    @JsonProperty("generated_at")
    private String generatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RecommendedCourse {

        @JsonProperty("course_id")
        private String courseId;

        @JsonProperty("title")
        private String title;

        @JsonProperty("domain")
        private String domain;

        @JsonProperty("difficulty")
        private String difficulty;

        @JsonProperty("duration_weeks")
        private Integer durationWeeks;

        @JsonProperty("skills_covered")
        private List<String> skillsCovered;

        @JsonProperty("explanation")
        private String explanation;

        @JsonProperty("youtube_link")
        private String youtubeLink;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RecommendedProject {

        @JsonProperty("project_id")
        private String projectId;

        @JsonProperty("title")
        private String title;

        @JsonProperty("domain")
        private String domain;

        @JsonProperty("difficulty")
        private String difficulty;

        @JsonProperty("complexity")
        private String complexity;

        @JsonProperty("duration_weeks")
        private Integer durationWeeks;

        @JsonProperty("skills_required")
        private List<String> skillsRequired;

        @JsonProperty("explanation")
        private String explanation;

        @JsonProperty("youtube_link")
        private String youtubeLink;
    }
}
