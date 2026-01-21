package com.hackathon.securestarter.service;

import com.hackathon.securestarter.dto.response.CareerPathwayResponse;
import com.hackathon.securestarter.dto.response.SkillGapAnalysisResponse;
import com.hackathon.securestarter.entity.CareerProfile;
import com.hackathon.securestarter.entity.SkillProfile;
import com.hackathon.securestarter.exception.ResourceNotFoundException;
import com.hackathon.securestarter.repository.CareerProfileRepository;
import com.hackathon.securestarter.repository.SkillProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Service for skill gap analysis and career pathway generation.
 * Provides AI-driven insights for career development.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsService {

    private final CareerProfileRepository careerProfileRepository;
    private final SkillProfileRepository skillProfileRepository;
    private final SkillProfileService skillProfileService;

    // Required skills mapping by industry and role
    private static final Map<String, Map<String, List<String>>> REQUIRED_SKILLS = new HashMap<>();

    static {
        // Healthcare Technology Skills
        Map<String, List<String>> healthcareRoles = new HashMap<>();
        healthcareRoles.put("Health Informatics Specialist", Arrays.asList(
                "Electronic Health Records (EHR)", "HL7/FHIR Standards", "Healthcare Security (HIPAA)",
                "Communication", "Problem Solving"
        ));
        healthcareRoles.put("Medical Software Developer", Arrays.asList(
                "Electronic Health Records (EHR)", "HL7/FHIR Standards", "Medical Imaging",
                "Healthcare Security (HIPAA)", "Problem Solving", "Teamwork"
        ));
        healthcareRoles.put("Telemedicine Engineer", Arrays.asList(
                "Telemedicine", "Healthcare Security (HIPAA)", "Communication",
                "Problem Solving", "Teamwork"
        ));
        healthcareRoles.put("Clinical Data Analyst", Arrays.asList(
                "Electronic Health Records (EHR)", "HL7/FHIR Standards", "Problem Solving", "Communication"
        ));
        REQUIRED_SKILLS.put("Healthcare", healthcareRoles);

        // Agricultural Technology Skills
        Map<String, List<String>> agricultureRoles = new HashMap<>();
        agricultureRoles.put("Precision Agriculture Specialist", Arrays.asList(
                "IoT Sensors", "Precision Agriculture", "Crop Modeling", "Soil Analysis",
                "Problem Solving", "Teamwork"
        ));
        agricultureRoles.put("Agricultural Data Scientist", Arrays.asList(
                "Precision Agriculture", "Crop Modeling", "Soil Analysis",
                "Problem Solving", "Communication"
        ));
        agricultureRoles.put("Drone Operations Manager", Arrays.asList(
                "Drone Operations", "IoT Sensors", "Precision Agriculture",
                "Leadership", "Communication"
        ));
        agricultureRoles.put("AgriTech Developer", Arrays.asList(
                "IoT Sensors", "Precision Agriculture", "Crop Modeling",
                "Problem Solving", "Teamwork"
        ));
        REQUIRED_SKILLS.put("Agriculture", agricultureRoles);

        // Urban/Smart City Skills
        Map<String, List<String>> urbanRoles = new HashMap<>();
        urbanRoles.put("Smart City Architect", Arrays.asList(
                "Geographic Information Systems (GIS)", "Smart Grid", "Urban IoT", "Building Automation",
                "Leadership", "Communication", "Problem Solving"
        ));
        urbanRoles.put("Urban IoT Engineer", Arrays.asList(
                "Urban IoT", "Smart Grid", "Traffic Management",
                "Problem Solving", "Teamwork"
        ));
        urbanRoles.put("GIS Analyst", Arrays.asList(
                "Geographic Information Systems (GIS)", "Urban IoT",
                "Problem Solving", "Communication"
        ));
        urbanRoles.put("Traffic Systems Engineer", Arrays.asList(
                "Traffic Management", "Urban IoT", "Geographic Information Systems (GIS)",
                "Problem Solving", "Teamwork"
        ));
        REQUIRED_SKILLS.put("Urban", urbanRoles);
    }

    /**
     * Analyze skill gaps for a user based on their target role
     * @param userId the user's UUID
     * @return SkillGapAnalysisResponse with detailed analysis
     */
    public SkillGapAnalysisResponse analyzeSkillGaps(UUID userId) {
        CareerProfile careerProfile = careerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Career profile not found. Please complete onboarding first."));

        SkillProfile skillProfile = skillProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill profile not found. Please complete onboarding first."));

        String industrySector = careerProfile.getIndustrySector();
        String targetRole = careerProfile.getTargetJobRole();

        // Get current skills
        List<String> currentSkills = skillProfileService.getAllCurrentSkills(skillProfile);

        // Get required skills for target role (or default industry skills)
        List<String> requiredSkills = getRequiredSkillsForRole(industrySector, targetRole);

        // Calculate missing skills
        List<String> missingSkills = new ArrayList<>(requiredSkills);
        missingSkills.removeAll(currentSkills);

        // Calculate match percentage
        int matchedCount = requiredSkills.size() - missingSkills.size();
        double matchPercentage = requiredSkills.isEmpty() ? 0 : 
                (matchedCount * 100.0) / requiredSkills.size();

        // Generate priority skills to learn
        List<SkillGapAnalysisResponse.SkillPriority> prioritySkills = generatePrioritySkills(
                missingSkills, industrySector
        );

        // Generate learning path recommendations
        List<String> learningPath = generateLearningPath(missingSkills, industrySector);

        return SkillGapAnalysisResponse.builder()
                .targetJobRole(targetRole)
                .industrySector(industrySector)
                .currentSkills(currentSkills)
                .currentSkillsCount(currentSkills.size())
                .requiredSkills(requiredSkills)
                .requiredSkillsCount(requiredSkills.size())
                .missingSkills(missingSkills)
                .missingSkillsCount(missingSkills.size())
                .skillMatchPercentage(Math.round(matchPercentage * 100.0) / 100.0)
                .readinessAssessment(SkillGapAnalysisResponse.calculateReadinessAssessment(matchPercentage))
                .prioritySkillsToLearn(prioritySkills)
                .recommendedLearningPath(learningPath)
                .build();
    }

    /**
     * Generate career pathway for a user
     * @param userId the user's UUID
     * @return CareerPathwayResponse with milestones
     */
    public CareerPathwayResponse generateCareerPathway(UUID userId) {
        CareerProfile careerProfile = careerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Career profile not found"));

        SkillProfile skillProfile = skillProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill profile not found"));

        String industrySector = careerProfile.getIndustrySector();
        String targetRole = careerProfile.getTargetJobRole();
        List<String> currentSkills = skillProfileService.getAllCurrentSkills(skillProfile);
        List<String> requiredSkills = getRequiredSkillsForRole(industrySector, targetRole);

        // Determine current level
        int matchedCount = (int) requiredSkills.stream().filter(currentSkills::contains).count();
        double matchPercentage = requiredSkills.isEmpty() ? 0 : (matchedCount * 100.0) / requiredSkills.size();
        String currentLevel = determineCurrentLevel(matchPercentage);

        // Generate milestones
        List<CareerPathwayResponse.CareerMilestone> milestones = generateMilestones(
                industrySector, targetRole, currentSkills, requiredSkills
        );

        // Calculate estimated time
        int estimatedMonths = calculateEstimatedTime(milestones);

        // Generate key actions
        List<String> keyActions = generateKeyActions(industrySector, matchPercentage);

        return CareerPathwayResponse.builder()
                .currentLevel(currentLevel)
                .targetJobRole(targetRole)
                .industrySector(industrySector)
                .estimatedTimeToReady(estimatedMonths)
                .milestones(milestones)
                .keyActions(keyActions)
                .summary(generatePathwaySummary(currentLevel, targetRole, estimatedMonths))
                .build();
    }

    /**
     * Get required skills for a specific role
     */
    private List<String> getRequiredSkillsForRole(String industrySector, String targetRole) {
        Map<String, List<String>> sectorRoles = REQUIRED_SKILLS.get(industrySector);
        
        if (sectorRoles != null && sectorRoles.containsKey(targetRole)) {
            return new ArrayList<>(sectorRoles.get(targetRole));
        }

        // Return default skills for the sector if role not found
        return getDefaultSectorSkills(industrySector);
    }

    /**
     * Get default skills for a sector
     */
    private List<String> getDefaultSectorSkills(String industrySector) {
        return switch (industrySector) {
            case "Healthcare" -> Arrays.asList(
                    "Electronic Health Records (EHR)", "HL7/FHIR Standards",
                    "Healthcare Security (HIPAA)", "Communication", "Problem Solving"
            );
            case "Agriculture" -> Arrays.asList(
                    "IoT Sensors", "Precision Agriculture", "Crop Modeling",
                    "Communication", "Problem Solving"
            );
            case "Urban" -> Arrays.asList(
                    "Geographic Information Systems (GIS)", "Urban IoT", "Smart Grid",
                    "Communication", "Problem Solving"
            );
            default -> Arrays.asList("Communication", "Problem Solving", "Teamwork", "Leadership");
        };
    }

    /**
     * Generate priority skills with reasons
     */
    private List<SkillGapAnalysisResponse.SkillPriority> generatePrioritySkills(
            List<String> missingSkills, String industrySector
    ) {
        List<SkillGapAnalysisResponse.SkillPriority> priorities = new ArrayList<>();
        
        for (int i = 0; i < missingSkills.size(); i++) {
            String skill = missingSkills.get(i);
            String priority = i < 2 ? "High" : (i < 4 ? "Medium" : "Low");
            String reason = generateSkillReason(skill, industrySector, priority);
            
            priorities.add(SkillGapAnalysisResponse.SkillPriority.builder()
                    .skillName(skill)
                    .priority(priority)
                    .reason(reason)
                    .build());
        }
        
        return priorities;
    }

    /**
     * Generate reason for learning a skill
     */
    private String generateSkillReason(String skill, String industrySector, String priority) {
        if (priority.equals("High")) {
            return "Core requirement for " + industrySector + " technology roles. Essential for entry-level positions.";
        } else if (priority.equals("Medium")) {
            return "Important for career advancement in " + industrySector + ". Will differentiate you from other candidates.";
        } else {
            return "Valuable complementary skill that enhances overall effectiveness in " + industrySector + ".";
        }
    }

    /**
     * Generate recommended learning path
     */
    private List<String> generateLearningPath(List<String> missingSkills, String industrySector) {
        List<String> path = new ArrayList<>();
        
        path.add("1. Start with foundational concepts in " + industrySector + " technology");
        
        if (!missingSkills.isEmpty()) {
            path.add("2. Learn " + missingSkills.get(0) + " through online courses and hands-on practice");
        }
        if (missingSkills.size() > 1) {
            path.add("3. Build projects applying " + missingSkills.get(1) + " to real-world scenarios");
        }
        if (missingSkills.size() > 2) {
            path.add("4. Obtain certifications in " + missingSkills.get(2));
        }
        
        path.add((path.size() + 1) + ". Build a portfolio showcasing your " + industrySector + " projects");
        path.add((path.size() + 1) + ". Network with professionals in the " + industrySector + " industry");
        
        return path;
    }

    /**
     * Determine current career level
     */
    private String determineCurrentLevel(double matchPercentage) {
        if (matchPercentage >= 80) return "Job Ready";
        if (matchPercentage >= 60) return "Advanced Learner";
        if (matchPercentage >= 40) return "Intermediate";
        if (matchPercentage >= 20) return "Beginner";
        return "Getting Started";
    }

    /**
     * Generate career milestones
     */
    private List<CareerPathwayResponse.CareerMilestone> generateMilestones(
            String industrySector, String targetRole,
            List<String> currentSkills, List<String> requiredSkills
    ) {
        List<CareerPathwayResponse.CareerMilestone> milestones = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>(requiredSkills);
        missingSkills.removeAll(currentSkills);

        // Milestone 1: Foundation
        milestones.add(CareerPathwayResponse.CareerMilestone.builder()
                .order(1)
                .milestoneName("Build Foundation")
                .description("Master the fundamental concepts of " + industrySector + " technology")
                .skillsRequired(missingSkills.isEmpty() ? List.of("Review fundamentals") : 
                        missingSkills.subList(0, Math.min(2, missingSkills.size())))
                .suggestedCourses(List.of("Introduction to " + industrySector + " Technology",
                        industrySector + " Fundamentals"))
                .suggestedProjects(List.of("Basic " + industrySector.toLowerCase() + " data project"))
                .estimatedDuration("2-3 months")
                .isCompleted(missingSkills.size() <= requiredSkills.size() * 0.7)
                .build());

        // Milestone 2: Intermediate Skills
        milestones.add(CareerPathwayResponse.CareerMilestone.builder()
                .order(2)
                .milestoneName("Develop Core Skills")
                .description("Gain proficiency in core " + targetRole + " skills")
                .skillsRequired(missingSkills.size() > 2 ? 
                        missingSkills.subList(2, Math.min(4, missingSkills.size())) : 
                        List.of("Advanced practice"))
                .suggestedCourses(List.of("Advanced " + industrySector + " Systems",
                        targetRole + " Essentials"))
                .suggestedProjects(List.of("Intermediate " + industrySector.toLowerCase() + " application"))
                .estimatedDuration("3-4 months")
                .isCompleted(missingSkills.size() <= requiredSkills.size() * 0.4)
                .build());

        // Milestone 3: Advanced & Certification
        milestones.add(CareerPathwayResponse.CareerMilestone.builder()
                .order(3)
                .milestoneName("Achieve Expertise")
                .description("Attain expert-level knowledge and industry certifications")
                .skillsRequired(missingSkills.size() > 4 ? 
                        missingSkills.subList(4, missingSkills.size()) : 
                        List.of("Expert-level mastery"))
                .suggestedCourses(List.of("Professional " + industrySector + " Certification",
                        targetRole + " Specialization"))
                .suggestedProjects(List.of("Capstone project: Full " + industrySector.toLowerCase() + " solution"))
                .estimatedDuration("2-3 months")
                .isCompleted(missingSkills.isEmpty())
                .build());

        // Milestone 4: Job Ready
        milestones.add(CareerPathwayResponse.CareerMilestone.builder()
                .order(4)
                .milestoneName("Career Launch")
                .description("Prepare for and land your target role as " + targetRole)
                .skillsRequired(List.of("Interview skills", "Portfolio presentation"))
                .suggestedCourses(List.of("Technical Interview Preparation",
                        "Professional Communication"))
                .suggestedProjects(List.of("Build comprehensive portfolio",
                        "Contribute to open-source " + industrySector.toLowerCase() + " projects"))
                .estimatedDuration("1-2 months")
                .isCompleted(false)
                .build());

        return milestones;
    }

    /**
     * Calculate estimated time to be job ready
     */
    private int calculateEstimatedTime(List<CareerPathwayResponse.CareerMilestone> milestones) {
        int months = 0;
        for (var milestone : milestones) {
            if (!Boolean.TRUE.equals(milestone.getIsCompleted())) {
                // Parse duration like "2-3 months" and take average
                String duration = milestone.getEstimatedDuration();
                if (duration != null && duration.contains("-")) {
                    String[] parts = duration.split("-");
                    int min = Integer.parseInt(parts[0].trim());
                    int max = Integer.parseInt(parts[1].replaceAll("[^0-9]", "").trim());
                    months += (min + max) / 2;
                }
            }
        }
        return months;
    }

    /**
     * Generate key actions based on current progress
     */
    private List<String> generateKeyActions(String industrySector, double matchPercentage) {
        List<String> actions = new ArrayList<>();
        
        if (matchPercentage < 30) {
            actions.add("Enroll in foundational " + industrySector + " technology courses");
            actions.add("Start with beginner-friendly projects to build confidence");
            actions.add("Join online communities related to " + industrySector + " tech");
        } else if (matchPercentage < 60) {
            actions.add("Focus on intermediate-level courses to fill skill gaps");
            actions.add("Build portfolio projects demonstrating your skills");
            actions.add("Consider obtaining industry certifications");
        } else if (matchPercentage < 80) {
            actions.add("Work on advanced projects to showcase expertise");
            actions.add("Pursue professional certifications in " + industrySector);
            actions.add("Start networking with industry professionals");
        } else {
            actions.add("Polish your portfolio and update your resume");
            actions.add("Practice technical interviews");
            actions.add("Apply to " + industrySector + " technology companies");
        }
        
        return actions;
    }

    /**
     * Generate pathway summary
     */
    private String generatePathwaySummary(String currentLevel, String targetRole, int estimatedMonths) {
        return String.format(
                "You are currently at the '%s' level. With focused effort on the recommended courses and projects, " +
                "you can be ready for a %s position in approximately %d months. " +
                "Follow the milestone-based approach and track your progress regularly.",
                currentLevel, targetRole, estimatedMonths
        );
    }
}
