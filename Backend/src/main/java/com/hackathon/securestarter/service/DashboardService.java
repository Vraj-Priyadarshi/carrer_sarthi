package com.hackathon.securestarter.service;

import com.hackathon.securestarter.dto.response.AcademicProfileResponse;
import com.hackathon.securestarter.dto.response.CourseListResponse;
import com.hackathon.securestarter.dto.response.DashboardSummaryResponse;
import com.hackathon.securestarter.dto.response.ExternalApiResponse;
import com.hackathon.securestarter.dto.response.ProjectListResponse;
import com.hackathon.securestarter.entity.AcademicProfile;
import com.hackathon.securestarter.entity.CareerProfile;
import com.hackathon.securestarter.entity.SkillProfile;
import com.hackathon.securestarter.entity.User;
import com.hackathon.securestarter.exception.ResourceNotFoundException;
import com.hackathon.securestarter.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Service for generating comprehensive dashboard data.
 * Aggregates information from all user profiles.
 * Integrates with external ML APIs for recommendations and predictions.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService {

    private final UserRepository userRepository;
    private final AcademicProfileRepository academicProfileRepository;
    private final CareerProfileRepository careerProfileRepository;
    private final SkillProfileRepository skillProfileRepository;
    private final CourseRepository courseRepository;
    private final ProjectRepository projectRepository;
    private final CertificationRepository certificationRepository;
    
    private final SkillProfileService skillProfileService;
    private final CourseService courseService;
    private final ProjectService projectService;
    private final CertificationService certificationService;
    private final ExternalApiService externalApiService;

    /**
     * Get comprehensive dashboard summary for a user
     * @param userId the user's UUID
     * @return DashboardSummaryResponse with all aggregated data
     */
    public DashboardSummaryResponse getDashboardSummary(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Build academic summary
        DashboardSummaryResponse.AcademicSummary academicSummary = buildAcademicSummary(userId);

        // Build career summary
        DashboardSummaryResponse.CareerSummary careerSummary = buildCareerSummary(userId);

        // Build skills summary
        DashboardSummaryResponse.SkillsSummary skillsSummary = buildSkillsSummary(userId, careerSummary);

        // Build skill profile detail (individual skill booleans for UI)
        DashboardSummaryResponse.SkillProfileDetail skillProfile = buildSkillProfileDetail(userId);

        // Build learning progress summary
        DashboardSummaryResponse.LearningProgressSummary learningProgress = buildLearningProgressSummary(userId);

        // Calculate overall readiness score
        Integer readinessScore = calculateReadinessScore(
                academicSummary, skillsSummary, learningProgress, careerSummary
        );

        // Fetch external API data (ML Recommendations & Skill Predictions)
        log.info("Fetching external API data for user: {}", userId);
        ExternalApiResponse externalApiData = externalApiService.getExternalApiData(userId);

        return DashboardSummaryResponse.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .onboardingCompleted(user.getOnboardingCompleted())
                .onboardingCompletedAt(user.getOnboardingCompletedAt())
                .academicSummary(academicSummary)
                .careerSummary(careerSummary)
                .skillsSummary(skillsSummary)
                .skillProfile(skillProfile)
                .learningProgress(learningProgress)
                .overallReadinessScore(readinessScore)
                .readinessLevel(DashboardSummaryResponse.calculateReadinessLevel(readinessScore))
                .externalApiData(externalApiData)
                .build();
    }

    /**
     * Build academic summary
     */
    private DashboardSummaryResponse.AcademicSummary buildAcademicSummary(UUID userId) {
        return academicProfileRepository.findByUserId(userId)
                .map(profile -> DashboardSummaryResponse.AcademicSummary.builder()
                        .educationLevel(AcademicProfileResponse.getEducationLevelDescription(profile.getEducationLevel()))
                        .cgpaPercentage(profile.getCgpaPercentage())
                        .fieldOfStudy(profile.getFieldOfStudy())
                        .institution(profile.getInstitution())
                        .build())
                .orElse(null);
    }

    /**
     * Build career summary
     */
    private DashboardSummaryResponse.CareerSummary buildCareerSummary(UUID userId) {
        return careerProfileRepository.findByUserId(userId)
                .map(profile -> DashboardSummaryResponse.CareerSummary.builder()
                        .industrySector(profile.getIndustrySector())
                        .targetJobRole(profile.getTargetJobRole())
                        .careerGoals(profile.getCareerGoals())
                        .build())
                .orElse(null);
    }

    /**
     * Build skills summary
     */
    private DashboardSummaryResponse.SkillsSummary buildSkillsSummary(
            UUID userId, 
            DashboardSummaryResponse.CareerSummary careerSummary
    ) {
        SkillProfile skillProfile = skillProfileRepository.findByUserId(userId).orElse(null);
        
        if (skillProfile == null) {
            return null;
        }

        int healthcareCount = skillProfileService.countHealthcareSkills(skillProfile);
        int agricultureCount = skillProfileService.countAgricultureSkills(skillProfile);
        int urbanCount = skillProfileService.countUrbanSkills(skillProfile);
        int softCount = skillProfileService.countSoftSkills(skillProfile);
        int totalCount = healthcareCount + agricultureCount + urbanCount + softCount;

        // Calculate relevant skills for the target sector
        int relevantSkills = 0;
        if (careerSummary != null && careerSummary.getIndustrySector() != null) {
            relevantSkills = switch (careerSummary.getIndustrySector()) {
                case "Healthcare" -> healthcareCount + softCount;
                case "Agriculture" -> agricultureCount + softCount;
                case "Urban" -> urbanCount + softCount;
                default -> softCount;
            };
        }

        return DashboardSummaryResponse.SkillsSummary.builder()
                .totalSkillsCount(totalCount)
                .healthcareSkillsCount(healthcareCount)
                .agricultureSkillsCount(agricultureCount)
                .urbanSkillsCount(urbanCount)
                .softSkillsCount(softCount)
                .relevantSkillsForSector(relevantSkills)
                .build();
    }

    /**
     * Build skill profile detail (individual skill booleans for UI display)
     */
    private DashboardSummaryResponse.SkillProfileDetail buildSkillProfileDetail(UUID userId) {
        return skillProfileRepository.findByUserId(userId)
                .map(profile -> DashboardSummaryResponse.SkillProfileDetail.builder()
                        // Healthcare
                        .hasEhr(profile.getHasEhr())
                        .hasHl7Fhir(profile.getHasHl7Fhir())
                        .hasMedicalImaging(profile.getHasMedicalImaging())
                        .hasHealthcareSecurity(profile.getHasHealthcareSecurity())
                        .hasTelemedicine(profile.getHasTelemedicine())
                        // Agriculture
                        .hasIotSensors(profile.getHasIotSensors())
                        .hasDroneOps(profile.getHasDroneOps())
                        .hasPrecisionAg(profile.getHasPrecisionAg())
                        .hasCropModeling(profile.getHasCropModeling())
                        .hasSoilAnalysis(profile.getHasSoilAnalysis())
                        // Urban
                        .hasGis(profile.getHasGis())
                        .hasSmartGrid(profile.getHasSmartGrid())
                        .hasTrafficMgmt(profile.getHasTrafficMgmt())
                        .hasUrbanIot(profile.getHasUrbanIot())
                        .hasBuildingAuto(profile.getHasBuildingAuto())
                        // Soft Skills
                        .hasCommunication(profile.getHasCommunication())
                        .hasTeamwork(profile.getHasTeamwork())
                        .hasProblemSolving(profile.getHasProblemSolving())
                        .hasLeadership(profile.getHasLeadership())
                        .build())
                .orElse(null);
    }

    /**
     * Build learning progress summary
     */
    private DashboardSummaryResponse.LearningProgressSummary buildLearningProgressSummary(UUID userId) {
        CourseListResponse courseData = courseService.getUserCourses(userId);
        ProjectListResponse projectData = projectService.getUserProjects(userId);
        
        long totalCerts = certificationService.getCertificationCount(userId);
        long activeCerts = certificationService.getActiveCertificationCount(userId);

        return DashboardSummaryResponse.LearningProgressSummary.builder()
                .totalCourses(courseData.getTotalCourses())
                .averageGrade(courseData.getAverageGrade())
                .coursePerformanceLevel(courseData.getPerformanceLevel())
                .totalProjects(projectData.getTotalProjects())
                .averageComplexity(projectData.getAverageComplexity())
                .projectExperienceLevel(projectData.getExperienceLevel())
                .totalCertifications((int) totalCerts)
                .activeCertifications((int) activeCerts)
                .build();
    }

    /**
     * Calculate overall readiness score (0-100)
     * Formula considers education, skills, courses, projects, and certifications
     */
    private Integer calculateReadinessScore(
            DashboardSummaryResponse.AcademicSummary academic,
            DashboardSummaryResponse.SkillsSummary skills,
            DashboardSummaryResponse.LearningProgressSummary learning,
            DashboardSummaryResponse.CareerSummary career
    ) {
        int score = 0;
        int maxScore = 100;
        
        // Education level contribution (max 15 points)
        if (academic != null) {
            // Higher education = more points
            String level = academic.getEducationLevel();
            if (level != null) {
                score += switch (level) {
                    case "PhD" -> 15;
                    case "Postgraduate" -> 12;
                    case "Undergraduate" -> 10;
                    case "High School" -> 5;
                    default -> 0;
                };
            }
            
            // CGPA contribution (max 10 points)
            if (academic.getCgpaPercentage() != null) {
                score += Math.min(10, (int) (academic.getCgpaPercentage() / 10));
            }
        }

        // Skills contribution (max 25 points)
        if (skills != null && skills.getTotalSkillsCount() != null) {
            // Max 19 skills possible, each worth ~1.3 points
            score += Math.min(25, (int) (skills.getTotalSkillsCount() * 1.3));
        }

        // Courses contribution (max 20 points)
        if (learning != null && learning.getTotalCourses() != null) {
            // Course count contribution (max 10 points)
            score += Math.min(10, learning.getTotalCourses());
            
            // Grade contribution (max 10 points)
            if (learning.getAverageGrade() != null) {
                score += Math.min(10, (int) (learning.getAverageGrade() / 10));
            }
        }

        // Projects contribution (max 20 points)
        if (learning != null && learning.getTotalProjects() != null) {
            // Project count (max 10 points)
            score += Math.min(10, learning.getTotalProjects() * 2);
            
            // Complexity contribution (max 10 points)
            if (learning.getAverageComplexity() != null) {
                score += Math.min(10, (int) (learning.getAverageComplexity() * 3.3));
            }
        }

        // Certifications contribution (max 10 points)
        if (learning != null && learning.getActiveCertifications() != null) {
            score += Math.min(10, learning.getActiveCertifications() * 2);
        }

        return Math.min(maxScore, score);
    }
}
