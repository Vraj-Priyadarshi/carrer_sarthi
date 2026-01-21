package com.hackathon.securestarter.controller;

import com.hackathon.securestarter.dto.response.DashboardSummaryResponse;
import com.hackathon.securestarter.entity.User;
import com.hackathon.securestarter.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST Controller for Dashboard operations.
 * Provides comprehensive user dashboard data.
 */
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Slf4j
public class DashboardController {

    private final DashboardService dashboardService;

    /**
     * Get comprehensive dashboard summary for current user
     * GET /api/dashboard/summary
     * @param currentUser authenticated user
     * @return DashboardSummaryResponse with all aggregated data
     */
    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryResponse> getDashboardSummary(
            @AuthenticationPrincipal User currentUser) {
        
        log.info("Get dashboard summary for user: {}", currentUser.getEmail());
        DashboardSummaryResponse response = dashboardService.getDashboardSummary(currentUser.getId());
        return ResponseEntity.ok(response);
    }
}
