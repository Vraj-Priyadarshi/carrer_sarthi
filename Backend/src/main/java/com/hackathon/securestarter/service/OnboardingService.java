package com.hackathon.securestarter.service;

import com.hackathon.securestarter.dto.request.OnboardingSubmitRequest;
import com.hackathon.securestarter.dto.response.MessageResponse;
import com.hackathon.securestarter.dto.response.OnboardingStatusResponse;
import com.hackathon.securestarter.entity.User;
import com.hackathon.securestarter.exception.BadRequestException;
import com.hackathon.securestarter.exception.ResourceNotFoundException;
import com.hackathon.securestarter.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Service for handling user onboarding process.
 * Manages the complete onboarding flow including profile creation.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OnboardingService {

    private final UserRepository userRepository;
    private final AcademicProfileRepository academicProfileRepository;
    private final CareerProfileRepository careerProfileRepository;
    private final SkillProfileRepository skillProfileRepository;
    private final CourseRepository courseRepository;
    private final ProjectRepository projectRepository;
    private final CertificationRepository certificationRepository;
    
    private final AcademicProfileService academicProfileService;
    private final CareerProfileService careerProfileService;
    private final SkillProfileService skillProfileService;
    private final CourseService courseService;
    private final ProjectService projectService;
    private final CertificationService certificationService;

    /**
     * Get onboarding status for a user
     * @param userId the user's UUID
     * @return OnboardingStatusResponse
     */
    public OnboardingStatusResponse getOnboardingStatus(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return OnboardingStatusResponse.builder()
                .onboardingCompleted(user.getOnboardingCompleted())
                .completedAt(user.getOnboardingCompletedAt())
                .hasAcademicProfile(academicProfileRepository.existsByUserId(userId))
                .hasCareerProfile(careerProfileRepository.existsByUserId(userId))
                .hasSkillProfile(skillProfileRepository.existsByUserId(userId))
                .coursesCount((int) courseRepository.countByUserId(userId))
                .projectsCount((int) projectRepository.countByUserId(userId))
                .certificationsCount((int) certificationRepository.countByUserId(userId))
                .build();
    }

    /**
     * Submit complete onboarding data
     * Creates all profile entities and marks onboarding as complete
     * @param userId the user's UUID
     * @param request the complete onboarding data
     * @return MessageResponse
     */
    @Transactional
    public MessageResponse submitOnboarding(UUID userId, OnboardingSubmitRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check if already onboarded (optional - can allow re-onboarding)
        if (Boolean.TRUE.equals(user.getOnboardingCompleted())) {
            log.info("User {} is re-submitting onboarding data", user.getEmail());
            // Delete existing data if re-onboarding
            deleteExistingOnboardingData(userId);
        }

        try {
            // 1. Create Academic Profile
            log.info("Creating academic profile for user: {}", user.getEmail());
            academicProfileService.createAcademicProfileEntity(user, request.getAcademicProfile());

            // 2. Create Career Profile
            log.info("Creating career profile for user: {}", user.getEmail());
            careerProfileService.createCareerProfileEntity(user, request.getCareerProfile());

            // 3. Create Skill Profile
            log.info("Creating skill profile for user: {}", user.getEmail());
            skillProfileService.createSkillProfileEntity(user, request.getSkillProfile());

            // 4. Create Courses (if any)
            if (request.getCourses() != null && !request.getCourses().isEmpty()) {
                log.info("Creating {} courses for user: {}", request.getCourses().size(), user.getEmail());
                courseService.createCoursesForUser(user, request.getCourses());
            }

            // 5. Create Projects (if any)
            if (request.getProjects() != null && !request.getProjects().isEmpty()) {
                log.info("Creating {} projects for user: {}", request.getProjects().size(), user.getEmail());
                projectService.createProjectsForUser(user, request.getProjects());
            }

            // 6. Create Certifications (if any)
            if (request.getCertifications() != null && !request.getCertifications().isEmpty()) {
                log.info("Creating {} certifications for user: {}", request.getCertifications().size(), user.getEmail());
                certificationService.createCertificationsForUser(user, request.getCertifications());
            }

            // 7. Mark onboarding as complete
            user.setOnboardingCompleted(true);
            user.setOnboardingCompletedAt(LocalDateTime.now());
            userRepository.save(user);

            log.info("Onboarding completed successfully for user: {}", user.getEmail());
            return MessageResponse.success("Onboarding completed successfully! Your profile has been created.");

        } catch (Exception e) {
            log.error("Error during onboarding for user: {} - {}", user.getEmail(), e.getMessage());
            throw new BadRequestException("Failed to complete onboarding: " + e.getMessage());
        }
    }

    /**
     * Delete existing onboarding data for re-onboarding
     * @param userId the user's UUID
     */
    @Transactional
    public void deleteExistingOnboardingData(UUID userId) {
        // Delete in reverse order of dependencies
        certificationRepository.deleteByUserId(userId);
        projectRepository.deleteByUserId(userId);
        courseRepository.deleteByUserId(userId);
        
        skillProfileRepository.findByUserId(userId).ifPresent(skillProfileRepository::delete);
        careerProfileRepository.findByUserId(userId).ifPresent(careerProfileRepository::delete);
        academicProfileRepository.findByUserId(userId).ifPresent(academicProfileRepository::delete);
        
        log.info("Deleted existing onboarding data for userId: {}", userId);
    }

    /**
     * Check if user has completed onboarding
     * @param userId the user's UUID
     * @return true if onboarding is complete
     */
    public boolean isOnboardingComplete(UUID userId) {
        return userRepository.findById(userId)
                .map(User::getOnboardingCompleted)
                .orElse(false);
    }
}
