package com.hackathon.securestarter.service;

import com.hackathon.securestarter.dto.response.CourseRecommendationResponse;
import com.hackathon.securestarter.dto.response.ProjectRecommendationResponse;
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
 * Service for generating personalized recommendations.
 * Provides course and project recommendations based on skill gaps and career goals.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RecommendationService {

    private final CareerProfileRepository careerProfileRepository;
    private final SkillProfileRepository skillProfileRepository;
    private final SkillProfileService skillProfileService;
    private final AnalyticsService analyticsService;

    // Course recommendations database
    private static final Map<String, List<CourseRecommendationResponse.RecommendedCourse>> COURSE_DATABASE = new HashMap<>();

    // Project ideas database
    private static final Map<String, List<ProjectRecommendationResponse.RecommendedProject>> PROJECT_DATABASE = new HashMap<>();

    static {
        initializeCourseDatabase();
        initializeProjectDatabase();
    }

    private static void initializeCourseDatabase() {
        // Healthcare courses
        List<CourseRecommendationResponse.RecommendedCourse> healthcareCourses = new ArrayList<>();
        healthcareCourses.add(CourseRecommendationResponse.RecommendedCourse.builder()
                .courseName("Health Informatics Fundamentals")
                .description("Learn the basics of health informatics including EHR systems, data standards, and healthcare workflows.")
                .skillsCovered("Electronic Health Records (EHR), HL7/FHIR Standards")
                .platform("Coursera")
                .difficulty("Beginner")
                .estimatedDuration("6 weeks")
                .priority("High")
                .reason("Essential foundation for any healthcare technology career")
                .build());
        healthcareCourses.add(CourseRecommendationResponse.RecommendedCourse.builder()
                .courseName("HIPAA Compliance and Healthcare Security")
                .description("Comprehensive training on healthcare data security, privacy regulations, and compliance requirements.")
                .skillsCovered("Healthcare Security (HIPAA)")
                .platform("edX")
                .difficulty("Intermediate")
                .estimatedDuration("4 weeks")
                .priority("High")
                .reason("Required knowledge for handling patient data in any healthcare role")
                .build());
        healthcareCourses.add(CourseRecommendationResponse.RecommendedCourse.builder()
                .courseName("Medical Imaging and DICOM Standards")
                .description("Deep dive into medical imaging technologies, DICOM protocols, and image processing techniques.")
                .skillsCovered("Medical Imaging")
                .platform("Udemy")
                .difficulty("Intermediate")
                .estimatedDuration("8 weeks")
                .priority("Medium")
                .reason("Specialized skill highly valued in diagnostic imaging systems")
                .build());
        healthcareCourses.add(CourseRecommendationResponse.RecommendedCourse.builder()
                .courseName("Telemedicine Platform Development")
                .description("Build telemedicine applications with video conferencing, scheduling, and patient management features.")
                .skillsCovered("Telemedicine")
                .platform("LinkedIn Learning")
                .difficulty("Advanced")
                .estimatedDuration("10 weeks")
                .priority("Medium")
                .reason("Growing field with high demand post-pandemic")
                .build());
        COURSE_DATABASE.put("Healthcare", healthcareCourses);

        // Agriculture courses
        List<CourseRecommendationResponse.RecommendedCourse> agricultureCourses = new ArrayList<>();
        agricultureCourses.add(CourseRecommendationResponse.RecommendedCourse.builder()
                .courseName("IoT for Agriculture")
                .description("Learn to deploy and manage IoT sensor networks for agricultural monitoring and automation.")
                .skillsCovered("IoT Sensors, Precision Agriculture")
                .platform("Coursera")
                .difficulty("Beginner")
                .estimatedDuration("6 weeks")
                .priority("High")
                .reason("Foundation skill for modern agriculture technology")
                .build());
        agricultureCourses.add(CourseRecommendationResponse.RecommendedCourse.builder()
                .courseName("Drone Operations for Precision Farming")
                .description("Master agricultural drone operations including mapping, spraying, and crop monitoring.")
                .skillsCovered("Drone Operations")
                .platform("Udemy")
                .difficulty("Intermediate")
                .estimatedDuration("8 weeks")
                .priority("High")
                .reason("High-demand skill for precision agriculture operations")
                .build());
        agricultureCourses.add(CourseRecommendationResponse.RecommendedCourse.builder()
                .courseName("Crop Modeling and Predictive Analytics")
                .description("Use data science techniques for crop yield prediction and agricultural planning.")
                .skillsCovered("Crop Modeling")
                .platform("edX")
                .difficulty("Advanced")
                .estimatedDuration("10 weeks")
                .priority("Medium")
                .reason("Essential for agricultural data scientist roles")
                .build());
        agricultureCourses.add(CourseRecommendationResponse.RecommendedCourse.builder()
                .courseName("Soil Science and Analysis Techniques")
                .description("Learn soil composition analysis, fertility assessment, and precision soil management.")
                .skillsCovered("Soil Analysis")
                .platform("Coursera")
                .difficulty("Intermediate")
                .estimatedDuration("6 weeks")
                .priority("Medium")
                .reason("Critical for precision agriculture and sustainable farming")
                .build());
        COURSE_DATABASE.put("Agriculture", agricultureCourses);

        // Urban/Smart City courses
        List<CourseRecommendationResponse.RecommendedCourse> urbanCourses = new ArrayList<>();
        urbanCourses.add(CourseRecommendationResponse.RecommendedCourse.builder()
                .courseName("GIS for Smart Cities")
                .description("Master Geographic Information Systems for urban planning, mapping, and spatial analysis.")
                .skillsCovered("Geographic Information Systems (GIS)")
                .platform("Esri Academy")
                .difficulty("Beginner")
                .estimatedDuration("8 weeks")
                .priority("High")
                .reason("Core skill for any smart city technology role")
                .build());
        urbanCourses.add(CourseRecommendationResponse.RecommendedCourse.builder()
                .courseName("Smart Grid Technologies")
                .description("Understand smart grid infrastructure, energy management, and grid modernization.")
                .skillsCovered("Smart Grid")
                .platform("edX")
                .difficulty("Intermediate")
                .estimatedDuration("8 weeks")
                .priority("High")
                .reason("Essential for urban energy systems and sustainability")
                .build());
        urbanCourses.add(CourseRecommendationResponse.RecommendedCourse.builder()
                .courseName("Intelligent Traffic Management Systems")
                .description("Design and implement traffic monitoring, signal optimization, and congestion management systems.")
                .skillsCovered("Traffic Management")
                .platform("Udemy")
                .difficulty("Intermediate")
                .estimatedDuration("6 weeks")
                .priority("Medium")
                .reason("High-impact skill for urban mobility solutions")
                .build());
        urbanCourses.add(CourseRecommendationResponse.RecommendedCourse.builder()
                .courseName("Building Automation and IoT")
                .description("Learn building management systems, HVAC automation, and smart building technologies.")
                .skillsCovered("Building Automation, Urban IoT")
                .platform("LinkedIn Learning")
                .difficulty("Advanced")
                .estimatedDuration("10 weeks")
                .priority("Medium")
                .reason("Growing demand in commercial real estate and facility management")
                .build());
        COURSE_DATABASE.put("Urban", urbanCourses);
    }

    private static void initializeProjectDatabase() {
        // Healthcare projects
        List<ProjectRecommendationResponse.RecommendedProject> healthcareProjects = new ArrayList<>();
        healthcareProjects.add(ProjectRecommendationResponse.RecommendedProject.builder()
                .projectTitle("Patient Health Dashboard")
                .description("Build a web dashboard that visualizes patient health metrics from EHR data.")
                .skillsToApply("Electronic Health Records (EHR), Problem Solving")
                .skillsToLearn("Data visualization, Dashboard design")
                .suggestedComplexity(1)
                .complexityDescription("Beginner")
                .estimatedDuration("2-3 weeks")
                .industrySector("Healthcare")
                .potentialImpact("Demonstrates ability to work with healthcare data and create user-friendly interfaces")
                .keyFeatures(Arrays.asList("Patient data display", "Health metric charts", "Alert system"))
                .technologiesToUse(Arrays.asList("React/Vue.js", "Chart.js", "REST APIs"))
                .build());
        healthcareProjects.add(ProjectRecommendationResponse.RecommendedProject.builder()
                .projectTitle("FHIR Data Integration API")
                .description("Create an API that transforms and integrates data between different healthcare systems using FHIR standards.")
                .skillsToApply("HL7/FHIR Standards, Problem Solving")
                .skillsToLearn("API development, Data transformation")
                .suggestedComplexity(2)
                .complexityDescription("Intermediate")
                .estimatedDuration("4-6 weeks")
                .industrySector("Healthcare")
                .potentialImpact("Shows expertise in healthcare interoperability standards")
                .keyFeatures(Arrays.asList("FHIR resource handling", "Data validation", "Mapping engine"))
                .technologiesToUse(Arrays.asList("Spring Boot/Node.js", "HAPI FHIR", "JSON/XML"))
                .build());
        healthcareProjects.add(ProjectRecommendationResponse.RecommendedProject.builder()
                .projectTitle("Telemedicine Video Consultation Platform")
                .description("Build a complete telemedicine platform with video calls, scheduling, and prescription management.")
                .skillsToApply("Telemedicine, Healthcare Security (HIPAA), Communication")
                .skillsToLearn("WebRTC, Real-time systems")
                .suggestedComplexity(3)
                .complexityDescription("Advanced")
                .estimatedDuration("8-12 weeks")
                .industrySector("Healthcare")
                .potentialImpact("Comprehensive project showcasing full-stack healthcare development skills")
                .keyFeatures(Arrays.asList("Video conferencing", "Appointment scheduling", "E-prescriptions", "Patient records"))
                .technologiesToUse(Arrays.asList("WebRTC", "React", "Node.js", "PostgreSQL"))
                .build());
        PROJECT_DATABASE.put("Healthcare", healthcareProjects);

        // Agriculture projects
        List<ProjectRecommendationResponse.RecommendedProject> agricultureProjects = new ArrayList<>();
        agricultureProjects.add(ProjectRecommendationResponse.RecommendedProject.builder()
                .projectTitle("Farm Sensor Monitoring System")
                .description("Create a system to collect and display data from agricultural IoT sensors.")
                .skillsToApply("IoT Sensors, Problem Solving")
                .skillsToLearn("Sensor data processing, Real-time dashboards")
                .suggestedComplexity(1)
                .complexityDescription("Beginner")
                .estimatedDuration("2-3 weeks")
                .industrySector("Agriculture")
                .potentialImpact("Entry-level project demonstrating IoT data handling")
                .keyFeatures(Arrays.asList("Sensor data collection", "Real-time display", "Historical data"))
                .technologiesToUse(Arrays.asList("Arduino/Raspberry Pi", "MQTT", "React", "InfluxDB"))
                .build());
        agricultureProjects.add(ProjectRecommendationResponse.RecommendedProject.builder()
                .projectTitle("Crop Health Analysis from Drone Images")
                .description("Develop an application that analyzes drone imagery to assess crop health using NDVI.")
                .skillsToApply("Drone Operations, Precision Agriculture")
                .skillsToLearn("Image processing, Remote sensing")
                .suggestedComplexity(2)
                .complexityDescription("Intermediate")
                .estimatedDuration("4-6 weeks")
                .industrySector("Agriculture")
                .potentialImpact("Combines drone technology with agricultural analytics")
                .keyFeatures(Arrays.asList("Image upload", "NDVI calculation", "Health mapping"))
                .technologiesToUse(Arrays.asList("Python", "OpenCV", "GDAL", "Leaflet"))
                .build());
        agricultureProjects.add(ProjectRecommendationResponse.RecommendedProject.builder()
                .projectTitle("AI-Powered Crop Yield Predictor")
                .description("Build a machine learning system that predicts crop yields based on weather, soil, and historical data.")
                .skillsToApply("Crop Modeling, Soil Analysis, Problem Solving")
                .skillsToLearn("Machine learning, Predictive analytics")
                .suggestedComplexity(3)
                .complexityDescription("Advanced")
                .estimatedDuration("8-12 weeks")
                .industrySector("Agriculture")
                .potentialImpact("Advanced project showcasing ML skills in agriculture context")
                .keyFeatures(Arrays.asList("Data pipeline", "ML model training", "Prediction API", "Visualization"))
                .technologiesToUse(Arrays.asList("Python", "TensorFlow/PyTorch", "FastAPI", "PostgreSQL"))
                .build());
        PROJECT_DATABASE.put("Agriculture", agricultureProjects);

        // Urban/Smart City projects
        List<ProjectRecommendationResponse.RecommendedProject> urbanProjects = new ArrayList<>();
        urbanProjects.add(ProjectRecommendationResponse.RecommendedProject.builder()
                .projectTitle("Neighborhood Map Visualization")
                .description("Create an interactive map showing neighborhood facilities, demographics, and services.")
                .skillsToApply("Geographic Information Systems (GIS), Problem Solving")
                .skillsToLearn("Web mapping, Geospatial data handling")
                .suggestedComplexity(1)
                .complexityDescription("Beginner")
                .estimatedDuration("2-3 weeks")
                .industrySector("Urban")
                .potentialImpact("Foundation project for GIS and urban data visualization")
                .keyFeatures(Arrays.asList("Interactive map", "Layer controls", "Search functionality"))
                .technologiesToUse(Arrays.asList("Leaflet/Mapbox", "GeoJSON", "React/Vue"))
                .build());
        urbanProjects.add(ProjectRecommendationResponse.RecommendedProject.builder()
                .projectTitle("Smart Parking Management System")
                .description("Develop a system to track parking availability and guide drivers to open spots.")
                .skillsToApply("Urban IoT, Traffic Management")
                .skillsToLearn("Real-time systems, Mobile app development")
                .suggestedComplexity(2)
                .complexityDescription("Intermediate")
                .estimatedDuration("4-6 weeks")
                .industrySector("Urban")
                .potentialImpact("Practical smart city application with real-world use case")
                .keyFeatures(Arrays.asList("Parking sensors", "Availability display", "Navigation", "Reservations"))
                .technologiesToUse(Arrays.asList("IoT sensors", "React Native", "Node.js", "MongoDB"))
                .build());
        urbanProjects.add(ProjectRecommendationResponse.RecommendedProject.builder()
                .projectTitle("Smart City Energy Management Platform")
                .description("Build a comprehensive platform for monitoring and optimizing city-wide energy consumption.")
                .skillsToApply("Smart Grid, Building Automation, Urban IoT, Leadership")
                .skillsToLearn("Energy analytics, Optimization algorithms")
                .suggestedComplexity(3)
                .complexityDescription("Advanced")
                .estimatedDuration("10-14 weeks")
                .industrySector("Urban")
                .potentialImpact("Enterprise-level project demonstrating smart city expertise")
                .keyFeatures(Arrays.asList("Energy monitoring", "Predictive analytics", "Optimization", "Alerts"))
                .technologiesToUse(Arrays.asList("Python", "Apache Kafka", "React", "PostgreSQL", "TimescaleDB"))
                .build());
        PROJECT_DATABASE.put("Urban", urbanProjects);
    }

    /**
     * Get personalized course recommendations for a user
     * @param userId the user's UUID
     * @return CourseRecommendationResponse
     */
    public CourseRecommendationResponse getCourseRecommendations(UUID userId) {
        CareerProfile careerProfile = careerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Career profile not found. Please complete onboarding first."));

        SkillProfile skillProfile = skillProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill profile not found. Please complete onboarding first."));

        String industrySector = careerProfile.getIndustrySector();
        String targetRole = careerProfile.getTargetJobRole();
        List<String> currentSkills = skillProfileService.getAllCurrentSkills(skillProfile);

        // Get skill gap analysis
        SkillGapAnalysisResponse skillGaps = analyticsService.analyzeSkillGaps(userId);
        List<String> missingSkills = skillGaps.getMissingSkills();

        // Get courses for the industry
        List<CourseRecommendationResponse.RecommendedCourse> allCourses = 
                COURSE_DATABASE.getOrDefault(industrySector, new ArrayList<>());

        // Filter and prioritize courses based on missing skills
        List<CourseRecommendationResponse.RecommendedCourse> recommendedCourses = new ArrayList<>();
        
        for (var course : allCourses) {
            // Check if course covers any missing skills
            boolean coversMissingSkill = missingSkills.stream()
                    .anyMatch(skill -> course.getSkillsCovered().toLowerCase().contains(skill.toLowerCase()));
            
            if (coversMissingSkill || recommendedCourses.size() < 2) {
                recommendedCourses.add(course);
            }
        }

        // Sort by priority
        recommendedCourses.sort((a, b) -> {
            int priorityA = a.getPriority().equals("High") ? 0 : (a.getPriority().equals("Medium") ? 1 : 2);
            int priorityB = b.getPriority().equals("High") ? 0 : (b.getPriority().equals("Medium") ? 1 : 2);
            return priorityA - priorityB;
        });

        return CourseRecommendationResponse.builder()
                .targetJobRole(targetRole)
                .industrySector(industrySector)
                .recommendedCourses(recommendedCourses)
                .totalRecommendations(recommendedCourses.size())
                .build();
    }

    /**
     * Get personalized project recommendations for a user
     * @param userId the user's UUID
     * @return ProjectRecommendationResponse
     */
    public ProjectRecommendationResponse getProjectRecommendations(UUID userId) {
        CareerProfile careerProfile = careerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Career profile not found. Please complete onboarding first."));

        SkillProfile skillProfile = skillProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill profile not found. Please complete onboarding first."));

        String industrySector = careerProfile.getIndustrySector();
        String targetRole = careerProfile.getTargetJobRole();
        List<String> currentSkills = skillProfileService.getAllCurrentSkills(skillProfile);

        // Get skill gap analysis to determine appropriate complexity
        SkillGapAnalysisResponse skillGaps = analyticsService.analyzeSkillGaps(userId);
        double matchPercentage = skillGaps.getSkillMatchPercentage();

        // Determine recommended complexity based on current skills
        int recommendedComplexity = matchPercentage >= 60 ? 3 : (matchPercentage >= 30 ? 2 : 1);

        // Get projects for the industry
        List<ProjectRecommendationResponse.RecommendedProject> allProjects = 
                PROJECT_DATABASE.getOrDefault(industrySector, new ArrayList<>());

        // Filter and sort projects
        List<ProjectRecommendationResponse.RecommendedProject> recommendedProjects = new ArrayList<>();
        
        // First add projects at the recommended complexity
        for (var project : allProjects) {
            if (project.getSuggestedComplexity() == recommendedComplexity) {
                recommendedProjects.add(project);
            }
        }
        
        // Then add others
        for (var project : allProjects) {
            if (project.getSuggestedComplexity() != recommendedComplexity && 
                !recommendedProjects.contains(project)) {
                recommendedProjects.add(project);
            }
        }

        return ProjectRecommendationResponse.builder()
                .targetJobRole(targetRole)
                .industrySector(industrySector)
                .recommendedProjects(recommendedProjects)
                .totalRecommendations(recommendedProjects.size())
                .build();
    }
}
