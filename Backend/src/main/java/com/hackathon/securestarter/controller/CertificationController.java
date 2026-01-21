package com.hackathon.securestarter.controller;

import com.hackathon.securestarter.dto.request.CertificationRequest;
import com.hackathon.securestarter.dto.response.CertificationListResponse;
import com.hackathon.securestarter.dto.response.CertificationResponse;
import com.hackathon.securestarter.dto.response.MessageResponse;
import com.hackathon.securestarter.entity.User;
import com.hackathon.securestarter.service.CertificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * REST Controller for Certification management operations.
 * Handles CRUD operations for user's certifications.
 */
@RestController
@RequestMapping("/api/certifications")
@RequiredArgsConstructor
@Slf4j
public class CertificationController {

    private final CertificationService certificationService;

    /**
     * Get all certifications for current user with statistics
     * GET /api/certifications/me
     * @param currentUser authenticated user
     * @return CertificationListResponse with certifications and stats
     */
    @GetMapping("/me")
    public ResponseEntity<CertificationListResponse> getUserCertifications(
            @AuthenticationPrincipal User currentUser) {
        
        log.info("Get certifications for user: {}", currentUser.getEmail());
        CertificationListResponse response = certificationService.getUserCertifications(currentUser.getId());
        return ResponseEntity.ok(response);
    }

    /**
     * Add a new certification
     * POST /api/certifications
     * @param request certification data
     * @param currentUser authenticated user
     * @return CertificationResponse
     */
    @PostMapping
    public ResponseEntity<CertificationResponse> addCertification(
            @Valid @RequestBody CertificationRequest request,
            @AuthenticationPrincipal User currentUser) {
        
        log.info("Add certification for user: {} - {}", currentUser.getEmail(), request.getCertificationName());
        CertificationResponse response = certificationService.addCertification(currentUser.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Delete a certification
     * DELETE /api/certifications/{id}
     * @param id certification UUID
     * @param currentUser authenticated user
     * @return MessageResponse
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteCertification(
            @PathVariable UUID id,
            @AuthenticationPrincipal User currentUser) {
        
        log.info("Delete certification {} for user: {}", id, currentUser.getEmail());
        certificationService.deleteCertification(currentUser.getId(), id);
        return ResponseEntity.ok(MessageResponse.success("Certification deleted successfully"));
    }
}
