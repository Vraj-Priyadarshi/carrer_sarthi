package com.hackathon.securestarter.controller;

import com.hackathon.securestarter.dto.request.SkillProfileRequest;
import com.hackathon.securestarter.dto.response.SkillProfileResponse;
import com.hackathon.securestarter.entity.User;
import com.hackathon.securestarter.service.SkillProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Skill Profile operations.
 * Handles skill profile CRUD operations.
 */
@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
@Slf4j
public class SkillProfileController {

    private final SkillProfileService skillProfileService;

    /**
     * Get current user's skill profile
     * GET /api/skills/me
     * @param currentUser authenticated user
     * @return SkillProfileResponse
     */
    @GetMapping("/me")
    public ResponseEntity<SkillProfileResponse> getSkillProfile(
            @AuthenticationPrincipal User currentUser) {
        
        log.info("Get skill profile for user: {}", currentUser.getEmail());
        SkillProfileResponse response = skillProfileService.getSkillProfile(currentUser.getId());
        return ResponseEntity.ok(response);
    }

    /**
     * Update current user's skill profile
     * PUT /api/skills/me
     * @param request skill profile data
     * @param currentUser authenticated user
     * @return SkillProfileResponse
     */
    @PutMapping("/me")
    public ResponseEntity<SkillProfileResponse> updateSkillProfile(
            @Valid @RequestBody SkillProfileRequest request,
            @AuthenticationPrincipal User currentUser) {
        
        log.info("Update skill profile for user: {}", currentUser.getEmail());
        SkillProfileResponse response = skillProfileService.createOrUpdateSkillProfile(
                currentUser.getId(), request);
        return ResponseEntity.ok(response);
    }
}
