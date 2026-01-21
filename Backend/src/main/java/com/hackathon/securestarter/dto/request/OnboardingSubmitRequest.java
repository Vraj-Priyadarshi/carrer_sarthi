package com.hackathon.securestarter.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * DTO for complete onboarding submission.
 * Contains all profile data submitted during onboarding flow.
 * This request handles the entire onboarding form in a single POST request.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OnboardingSubmitRequest {

    @NotNull(message = "Academic profile is required")
    @Valid
    private AcademicProfileRequest academicProfile;

    @NotNull(message = "Career profile is required")
    @Valid
    private CareerProfileRequest careerProfile;

    @NotNull(message = "Skill profile is required")
    @Valid
    private SkillProfileRequest skillProfile;

    @Valid
    @Builder.Default
    private List<CourseRequest> courses = new ArrayList<>();

    @Valid
    @Builder.Default
    private List<ProjectRequest> projects = new ArrayList<>();

    @Valid
    @Builder.Default
    private List<CertificationRequest> certifications = new ArrayList<>();
}
