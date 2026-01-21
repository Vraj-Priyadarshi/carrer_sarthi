package com.hackathon.securestarter.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Response DTO for onboarding status check.
 * Indicates whether user has completed onboarding.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OnboardingStatusResponse {

    private Boolean onboardingCompleted;
    private LocalDateTime completedAt;
    private Boolean hasAcademicProfile;
    private Boolean hasCareerProfile;
    private Boolean hasSkillProfile;
    private Integer coursesCount;
    private Integer projectsCount;
    private Integer certificationsCount;
}
