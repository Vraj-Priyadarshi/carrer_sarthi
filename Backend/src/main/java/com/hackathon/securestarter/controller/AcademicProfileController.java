package com.hackathon.securestarter.controller;

import com.hackathon.securestarter.dto.request.AcademicProfileRequest;
import com.hackathon.securestarter.dto.response.AcademicProfileResponse;
import com.hackathon.securestarter.entity.User;
import com.hackathon.securestarter.service.AcademicProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Academic Profile operations.
 * Handles CRUD operations for user's academic information.
 */
@RestController
@RequestMapping("/api/academics")
@RequiredArgsConstructor
@Slf4j
public class AcademicProfileController {

    private final AcademicProfileService academicProfileService;

    /**
     * Get current user's academic profile
     * GET /api/academics/me
     * @param currentUser authenticated user
     * @return AcademicProfileResponse
     */
    @GetMapping("/me")
    public ResponseEntity<AcademicProfileResponse> getAcademicProfile(
            @AuthenticationPrincipal User currentUser) {
        
        log.info("Get academic profile for user: {}", currentUser.getEmail());
        AcademicProfileResponse response = academicProfileService.getAcademicProfile(currentUser.getId());
        return ResponseEntity.ok(response);
    }

    /**
     * Update current user's academic profile
     * PUT /api/academics/me
     * @param request academic profile data
     * @param currentUser authenticated user
     * @return AcademicProfileResponse
     */
    @PutMapping("/me")
    public ResponseEntity<AcademicProfileResponse> updateAcademicProfile(
            @Valid @RequestBody AcademicProfileRequest request,
            @AuthenticationPrincipal User currentUser) {
        
        log.info("Update academic profile for user: {}", currentUser.getEmail());
        AcademicProfileResponse response = academicProfileService.createOrUpdateAcademicProfile(
                currentUser.getId(), request);
        return ResponseEntity.ok(response);
    }
}
