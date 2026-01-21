package com.hackathon.securestarter.controller;

import com.hackathon.securestarter.dto.request.CareerProfileRequest;
import com.hackathon.securestarter.dto.response.CareerPathwayResponse;
import com.hackathon.securestarter.dto.response.CareerProfileResponse;
import com.hackathon.securestarter.entity.User;
import com.hackathon.securestarter.service.AnalyticsService;
import com.hackathon.securestarter.service.CareerProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Career Profile operations.
 * Handles career profile CRUD and career pathway generation.
 */
@RestController
@RequestMapping("/api/career")
@RequiredArgsConstructor
@Slf4j
public class CareerProfileController {

    private final CareerProfileService careerProfileService;
    private final AnalyticsService analyticsService;

    /**
     * Get current user's career profile
     * GET /api/career/me
     * @param currentUser authenticated user
     * @return CareerProfileResponse
     */
    @GetMapping("/me")
    public ResponseEntity<CareerProfileResponse> getCareerProfile(
            @AuthenticationPrincipal User currentUser) {
        
        log.info("Get career profile for user: {}", currentUser.getEmail());
        CareerProfileResponse response = careerProfileService.getCareerProfile(currentUser.getId());
        return ResponseEntity.ok(response);
    }

    /**
     * Update current user's career profile
     * PUT /api/career/me
     * @param request career profile data
     * @param currentUser authenticated user
     * @return CareerProfileResponse
     */
    @PutMapping("/me")
    public ResponseEntity<CareerProfileResponse> updateCareerProfile(
            @Valid @RequestBody CareerProfileRequest request,
            @AuthenticationPrincipal User currentUser) {
        
        log.info("Update career profile for user: {}", currentUser.getEmail());
        CareerProfileResponse response = careerProfileService.createOrUpdateCareerProfile(
                currentUser.getId(), request);
        return ResponseEntity.ok(response);
    }

    /**
     * Get career pathway/roadmap for current user
     * GET /api/career/pathway
     * @param currentUser authenticated user
     * @return CareerPathwayResponse
     */
    @GetMapping("/pathway")
    public ResponseEntity<CareerPathwayResponse> getCareerPathway(
            @AuthenticationPrincipal User currentUser) {
        
        log.info("Get career pathway for user: {}", currentUser.getEmail());
        CareerPathwayResponse response = analyticsService.generateCareerPathway(currentUser.getId());
        return ResponseEntity.ok(response);
    }
}
