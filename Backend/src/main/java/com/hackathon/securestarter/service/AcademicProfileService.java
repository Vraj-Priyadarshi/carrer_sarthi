package com.hackathon.securestarter.service;

import com.hackathon.securestarter.dto.request.AcademicProfileRequest;
import com.hackathon.securestarter.dto.response.AcademicProfileResponse;
import com.hackathon.securestarter.entity.AcademicProfile;
import com.hackathon.securestarter.entity.User;
import com.hackathon.securestarter.exception.ResourceNotFoundException;
import com.hackathon.securestarter.repository.AcademicProfileRepository;
import com.hackathon.securestarter.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Service for managing Academic Profile operations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AcademicProfileService {

    private final AcademicProfileRepository academicProfileRepository;
    private final UserRepository userRepository;

    /**
     * Get academic profile for a user
     * @param userId the user's UUID
     * @return AcademicProfileResponse
     * @throws ResourceNotFoundException if profile not found
     */
    public AcademicProfileResponse getAcademicProfile(UUID userId) {
        AcademicProfile profile = academicProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Academic profile not found for user"));

        return mapToResponse(profile);
    }

    /**
     * Create or update academic profile for a user
     * @param userId the user's UUID
     * @param request the profile data
     * @return AcademicProfileResponse
     */
    @Transactional
    public AcademicProfileResponse createOrUpdateAcademicProfile(UUID userId, AcademicProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        AcademicProfile profile = academicProfileRepository.findByUserId(userId)
                .orElse(AcademicProfile.builder().user(user).build());

        // Update fields
        profile.setEducationLevel(request.getEducationLevel());
        profile.setCgpaPercentage(request.getCgpaPercentage());
        profile.setFieldOfStudy(request.getFieldOfStudy());
        profile.setInstitution(request.getInstitution());

        AcademicProfile savedProfile = academicProfileRepository.save(profile);
        log.info("Academic profile saved for user: {}", user.getEmail());

        return mapToResponse(savedProfile);
    }

    /**
     * Check if academic profile exists for user
     * @param userId the user's UUID
     * @return true if profile exists
     */
    public boolean hasAcademicProfile(UUID userId) {
        return academicProfileRepository.existsByUserId(userId);
    }

    /**
     * Delete academic profile for user
     * @param userId the user's UUID
     */
    @Transactional
    public void deleteAcademicProfile(UUID userId) {
        AcademicProfile profile = academicProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Academic profile not found"));
        
        academicProfileRepository.delete(profile);
        log.info("Academic profile deleted for userId: {}", userId);
    }

    /**
     * Create academic profile from request (internal use for onboarding)
     * @param user the user entity
     * @param request the profile request
     * @return saved AcademicProfile entity
     */
    @Transactional
    public AcademicProfile createAcademicProfileEntity(User user, AcademicProfileRequest request) {
        AcademicProfile profile = AcademicProfile.builder()
                .user(user)
                .educationLevel(request.getEducationLevel())
                .cgpaPercentage(request.getCgpaPercentage())
                .fieldOfStudy(request.getFieldOfStudy())
                .institution(request.getInstitution())
                .build();

        return academicProfileRepository.save(profile);
    }

    /**
     * Map entity to response DTO
     */
    private AcademicProfileResponse mapToResponse(AcademicProfile profile) {
        return AcademicProfileResponse.builder()
                .id(profile.getId())
                .educationLevel(profile.getEducationLevel())
                .educationLevelDescription(AcademicProfileResponse.getEducationLevelDescription(profile.getEducationLevel()))
                .cgpaPercentage(profile.getCgpaPercentage())
                .fieldOfStudy(profile.getFieldOfStudy())
                .institution(profile.getInstitution())
                .updatedAt(profile.getUpdatedAt())
                .createdAt(profile.getCreatedAt())
                .build();
    }
}
