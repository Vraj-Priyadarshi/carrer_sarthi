package com.hackathon.securestarter.controller;

import com.hackathon.securestarter.dto.response.SkillGapAnalysisResponse;
import com.hackathon.securestarter.entity.User;
import com.hackathon.securestarter.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST Controller for Analytics operations.
 * Provides skill gap analysis and career insights.
 */
@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@Slf4j
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    /**
     * Get skill gap analysis for current user
     * GET /api/analytics/skill-gaps
     * @param currentUser authenticated user
     * @return SkillGapAnalysisResponse with detailed analysis
     */
    @GetMapping("/skill-gaps")
    public ResponseEntity<SkillGapAnalysisResponse> getSkillGapAnalysis(
            @AuthenticationPrincipal User currentUser) {
        
        log.info("Get skill gap analysis for user: {}", currentUser.getEmail());
        SkillGapAnalysisResponse response = analyticsService.analyzeSkillGaps(currentUser.getId());
        return ResponseEntity.ok(response);
    }
}
