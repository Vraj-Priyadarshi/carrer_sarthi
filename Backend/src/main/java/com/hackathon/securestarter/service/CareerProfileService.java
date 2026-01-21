package com.hackathon.securestarter.service;

import com.hackathon.securestarter.dto.request.CareerProfileRequest;
import com.hackathon.securestarter.dto.response.CareerProfileResponse;
import com.hackathon.securestarter.entity.CareerProfile;
import com.hackathon.securestarter.entity.User;
import com.hackathon.securestarter.exception.ResourceNotFoundException;
import com.hackathon.securestarter.repository.CareerProfileRepository;
import com.hackathon.securestarter.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Service for managing Career Profile operations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CareerProfileService {

    private final CareerProfileRepository careerProfileRepository;
    private final UserRepository userRepository;

    /**
     * Get career profile for a user
     * @param userId the user's UUID
     * @return CareerProfileResponse
     * @throws ResourceNotFoundException if profile not found
     */
    public CareerProfileResponse getCareerProfile(UUID userId) {
        CareerProfile profile = careerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Career profile not found for user"));

        return mapToResponse(profile);
    }

    /**
     * Create or update career profile for a user
     * @param userId the user's UUID
     * @param request the profile data
     * @return CareerProfileResponse
     */
    @Transactional
    public CareerProfileResponse createOrUpdateCareerProfile(UUID userId, CareerProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        CareerProfile profile = careerProfileRepository.findByUserId(userId)
                .orElse(CareerProfile.builder().user(user).build());

        // Update fields
        profile.setIndustrySector(request.getIndustrySector());
        profile.setTargetJobRole(request.getTargetJobRole());
        profile.setCareerGoals(request.getCareerGoals());

        CareerProfile savedProfile = careerProfileRepository.save(profile);
        log.info("Career profile saved for user: {}", user.getEmail());

        return mapToResponse(savedProfile);
    }

    /**
     * Check if career profile exists for user
     * @param userId the user's UUID
     * @return true if profile exists
     */
    public boolean hasCareerProfile(UUID userId) {
        return careerProfileRepository.existsByUserId(userId);
    }

    /**
     * Delete career profile for user
     * @param userId the user's UUID
     */
    @Transactional
    public void deleteCareerProfile(UUID userId) {
        CareerProfile profile = careerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Career profile not found"));
        
        careerProfileRepository.delete(profile);
        log.info("Career profile deleted for userId: {}", userId);
    }

    /**
     * Create career profile from request (internal use for onboarding)
     * @param user the user entity
     * @param request the profile request
     * @return saved CareerProfile entity
     */
    @Transactional
    public CareerProfile createCareerProfileEntity(User user, CareerProfileRequest request) {
        CareerProfile profile = CareerProfile.builder()
                .user(user)
                .industrySector(request.getIndustrySector())
                .targetJobRole(request.getTargetJobRole())
                .careerGoals(request.getCareerGoals())
                .build();

        return careerProfileRepository.save(profile);
    }

    /**
     * Get career profile entity by user ID (internal use)
     * @param userId the user's UUID
     * @return CareerProfile entity or null
     */
    public CareerProfile getCareerProfileEntity(UUID userId) {
        return careerProfileRepository.findByUserId(userId).orElse(null);
    }

    /**
     * Map entity to response DTO
     */
    private CareerProfileResponse mapToResponse(CareerProfile profile) {
        return CareerProfileResponse.builder()
                .id(profile.getId())
                .industrySector(profile.getIndustrySector())
                .targetJobRole(profile.getTargetJobRole())
                .careerGoals(profile.getCareerGoals())
                .updatedAt(profile.getUpdatedAt())
                .createdAt(profile.getCreatedAt())
                .build();
    }
}
