package com.hackathon.securestarter.controller;

import com.hackathon.securestarter.dto.request.OnboardingSubmitRequest;
import com.hackathon.securestarter.dto.response.MessageResponse;
import com.hackathon.securestarter.dto.response.OnboardingStatusResponse;
import com.hackathon.securestarter.entity.User;
import com.hackathon.securestarter.service.OnboardingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for user onboarding operations.
 * Handles onboarding status checks and profile submission.
 */
@RestController
@RequestMapping("/api/onboarding")
@RequiredArgsConstructor
@Slf4j
public class OnboardingController {

    private final OnboardingService onboardingService;

    /**
     * Get onboarding status for current user
     * GET /api/onboarding/status
     * @param currentUser authenticated user
     * @return OnboardingStatusResponse
     */
    @GetMapping("/status")
    public ResponseEntity<OnboardingStatusResponse> getOnboardingStatus(
            @AuthenticationPrincipal User currentUser) {
        
        log.info("Onboarding status check for user: {}", currentUser.getEmail());
        OnboardingStatusResponse response = onboardingService.getOnboardingStatus(currentUser.getId());
        return ResponseEntity.ok(response);
    }

    /**
     * Submit complete onboarding data
     * POST /api/onboarding/submit
     * @param request complete onboarding form data
     * @param currentUser authenticated user
     * @return MessageResponse
     */
    @PostMapping("/submit")
    public ResponseEntity<MessageResponse> submitOnboarding(
            @Valid @RequestBody OnboardingSubmitRequest request,
            @AuthenticationPrincipal User currentUser) {
        
        log.info("Onboarding submission for user: {}", currentUser.getEmail());
        MessageResponse response = onboardingService.submitOnboarding(currentUser.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
