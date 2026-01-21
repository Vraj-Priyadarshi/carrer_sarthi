package com.hackathon.securestarter.controller;

import com.hackathon.securestarter.dto.response.CourseRecommendationResponse;
import com.hackathon.securestarter.dto.response.ProjectRecommendationResponse;
import com.hackathon.securestarter.entity.User;
import com.hackathon.securestarter.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST Controller for Recommendation operations.
 * Provides personalized course and project recommendations.
 */
@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
@Slf4j
public class RecommendationController {

    private final RecommendationService recommendationService;

    /**
     * Get personalized course recommendations for current user
     * GET /api/recommendations/courses
     * @param currentUser authenticated user
     * @return CourseRecommendationResponse
     */
    @GetMapping("/courses")
    public ResponseEntity<CourseRecommendationResponse> getCourseRecommendations(
            @AuthenticationPrincipal User currentUser) {
        
        log.info("Get course recommendations for user: {}", currentUser.getEmail());
        CourseRecommendationResponse response = recommendationService.getCourseRecommendations(currentUser.getId());
        return ResponseEntity.ok(response);
    }

    /**
     * Get personalized project recommendations for current user
     * GET /api/recommendations/projects
     * @param currentUser authenticated user
     * @return ProjectRecommendationResponse
     */
    @GetMapping("/projects")
    public ResponseEntity<ProjectRecommendationResponse> getProjectRecommendations(
            @AuthenticationPrincipal User currentUser) {
        
        log.info("Get project recommendations for user: {}", currentUser.getEmail());
        ProjectRecommendationResponse response = recommendationService.getProjectRecommendations(currentUser.getId());
        return ResponseEntity.ok(response);
    }
}
