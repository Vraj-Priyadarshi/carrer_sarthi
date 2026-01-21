package com.hackathon.securestarter.service;

import com.hackathon.securestarter.dto.request.MLRecommendationRequest;
import com.hackathon.securestarter.dto.request.SkillPredictRequest;
import com.hackathon.securestarter.dto.response.*;
import com.hackathon.securestarter.entity.*;
import com.hackathon.securestarter.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service for making external API calls.
 * Handles ML Recommendations, Skill Predictions, and YouTube video enrichment.
 */
@Service
@Slf4j
public class ExternalApiService {

    private final RestClient mlRecommendationsRestClient;
    private final RestClient skillPredictRestClient;
    private final RestClient youtubeRestClient;
    
    private final UserRepository userRepository;
    private final AcademicProfileRepository academicProfileRepository;
    private final CareerProfileRepository careerProfileRepository;
    private final SkillProfileRepository skillProfileRepository;
    private final CourseRepository courseRepository;
    private final ProjectRepository projectRepository;
    private final CertificationRepository certificationRepository;

    @Value("${external.api.youtube.api-key:}")
    private String youtubeApiKey;

    // Simple in-memory cache for YouTube links (title -> link)
    private final Map<String, String> youtubeCache = new ConcurrentHashMap<>();

    public ExternalApiService(
            @Qualifier("mlRecommendationsRestClient") RestClient mlRecommendationsRestClient,
            @Qualifier("skillPredictRestClient") RestClient skillPredictRestClient,
            @Qualifier("youtubeRestClient") RestClient youtubeRestClient,
            UserRepository userRepository,
            AcademicProfileRepository academicProfileRepository,
            CareerProfileRepository careerProfileRepository,
            SkillProfileRepository skillProfileRepository,
            CourseRepository courseRepository,
            ProjectRepository projectRepository,
            CertificationRepository certificationRepository) {
        this.mlRecommendationsRestClient = mlRecommendationsRestClient;
        this.skillPredictRestClient = skillPredictRestClient;
        this.youtubeRestClient = youtubeRestClient;
        this.userRepository = userRepository;
        this.academicProfileRepository = academicProfileRepository;
        this.careerProfileRepository = careerProfileRepository;
        this.skillProfileRepository = skillProfileRepository;
        this.courseRepository = courseRepository;
        this.projectRepository = projectRepository;
        this.certificationRepository = certificationRepository;
    }

    /**
     * Get external API data for the dashboard
     */
    public ExternalApiResponse getExternalApiData(UUID userId) {
        log.info("Fetching external API data for user: {}", userId);

        ExternalApiResponse.ApiCallStatus.ApiCallStatusBuilder statusBuilder = 
            ExternalApiResponse.ApiCallStatus.builder();
        
        MLRecommendationResponse recommendations = null;
        SkillPredictResponse skillPrediction = null;
        boolean youtubeSuccess = false;

        try {
            // Call ML Recommendations API
            recommendations = callMLRecommendationsApi(userId);
            statusBuilder.recommendationsSuccess(recommendations != null);

            if (recommendations != null) {
                // Enrich with YouTube links
                youtubeSuccess = enrichWithYoutubeLinks(recommendations);
            }
        } catch (Exception e) {
            log.error("Error calling ML Recommendations API: {}", e.getMessage(), e);
            statusBuilder.recommendationsSuccess(false);
        }

        try {
            // Call Skill Predict API
            skillPrediction = callSkillPredictApi(userId);
            statusBuilder.skillPredictSuccess(skillPrediction != null);
        } catch (Exception e) {
            log.error("Error calling Skill Predict API: {}", e.getMessage(), e);
            statusBuilder.skillPredictSuccess(false);
        }

        statusBuilder.youtubeEnrichmentSuccess(youtubeSuccess);

        return ExternalApiResponse.builder()
                .recommendations(recommendations)
                .skillPrediction(skillPrediction)
                .status(statusBuilder.build())
                .build();
    }

    /**
     * Call ML Recommendations API
     */
    private MLRecommendationResponse callMLRecommendationsApi(UUID userId) {
        log.info("Calling ML Recommendations API for user: {}", userId);

        // Build request from user data
        MLRecommendationRequest request = buildMLRecommendationRequest(userId);
        
        if (request == null) {
            log.warn("Unable to build ML recommendation request for user: {}", userId);
            return null;
        }

        try {
            MLRecommendationResponse response = mlRecommendationsRestClient.post()
                    .uri("/recommendations")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(MLRecommendationResponse.class);

            log.info("ML Recommendations API response received for user: {}", userId);
            return response;
        } catch (Exception e) {
            log.error("Failed to call ML Recommendations API: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * Call Skill Predict API
     */
    private SkillPredictResponse callSkillPredictApi(UUID userId) {
        log.info("Calling Skill Predict API for user: {}", userId);

        // Build request from user data
        SkillPredictRequest request = buildSkillPredictRequest(userId);
        
        if (request == null) {
            log.warn("Unable to build skill predict request for user: {}", userId);
            return null;
        }

        try {
            SkillPredictResponse response = skillPredictRestClient.post()
                    .uri("/skillPredict")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(SkillPredictResponse.class);

            log.info("Skill Predict API response received for user: {}", userId);
            return response;
        } catch (Exception e) {
            log.error("Failed to call Skill Predict API: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * Enrich recommendations with YouTube video links
     */
    private boolean enrichWithYoutubeLinks(MLRecommendationResponse recommendations) {
        if (youtubeApiKey == null || youtubeApiKey.isBlank()) {
            log.warn("YouTube API key not configured, skipping video enrichment");
            return false;
        }

        boolean success = true;

        // Enrich courses
        if (recommendations.getRecommendedCourses() != null) {
            for (MLRecommendationResponse.RecommendedCourse course : recommendations.getRecommendedCourses()) {
                try {
                    String youtubeLink = fetchYoutubeLink(course.getTitle());
                    course.setYoutubeLink(youtubeLink);
                } catch (Exception e) {
                    log.warn("Failed to fetch YouTube link for course '{}': {}", 
                            course.getTitle(), e.getMessage());
                    course.setYoutubeLink(null);
                    success = false;
                }
            }
        }

        // Enrich projects
        if (recommendations.getRecommendedProjects() != null) {
            for (MLRecommendationResponse.RecommendedProject project : recommendations.getRecommendedProjects()) {
                try {
                    String youtubeLink = fetchYoutubeLink(project.getTitle());
                    project.setYoutubeLink(youtubeLink);
                } catch (Exception e) {
                    log.warn("Failed to fetch YouTube link for project '{}': {}", 
                            project.getTitle(), e.getMessage());
                    project.setYoutubeLink(null);
                    success = false;
                }
            }
        }

        return success;
    }

    /**
     * Fetch YouTube video link for a given title
     */
    private String fetchYoutubeLink(String title) {
        if (title == null || title.isBlank()) {
            return null;
        }

        String trimmedTitle = title.trim();

        // Check cache first
        if (youtubeCache.containsKey(trimmedTitle)) {
            log.debug("YouTube link found in cache for title: {}", trimmedTitle);
            return youtubeCache.get(trimmedTitle);
        }

        try {
            String encodedTitle = URLEncoder.encode(trimmedTitle, StandardCharsets.UTF_8);

            String uri = UriComponentsBuilder.fromPath("/search")
                    .queryParam("part", "snippet")
                    .queryParam("q", encodedTitle)
                    .queryParam("type", "video")
                    .queryParam("maxResults", 1)
                    .queryParam("videoDuration", "medium")
                    .queryParam("videoEmbeddable", "true")
                    .queryParam("safeSearch", "strict")
                    .queryParam("relevanceLanguage", "en")
                    .queryParam("order", "relevance")
                    .queryParam("key", youtubeApiKey)
                    .build()
                    .toUriString();

            YouTubeSearchResponse response = youtubeRestClient.get()
                    .uri(uri)
                    .retrieve()
                    .body(YouTubeSearchResponse.class);

            if (response != null && response.getItems() != null && !response.getItems().isEmpty()) {
                YouTubeSearchResponse.SearchItem firstItem = response.getItems().get(0);
                if (firstItem.getId() != null && firstItem.getId().getVideoId() != null) {
                    String youtubeLink = "https://www.youtube.com/watch?v=" + firstItem.getId().getVideoId();
                    // Cache the result
                    youtubeCache.put(trimmedTitle, youtubeLink);
                    log.debug("YouTube link fetched for title '{}': {}", trimmedTitle, youtubeLink);
                    return youtubeLink;
                }
            }

            log.debug("No YouTube video found for title: {}", trimmedTitle);
            return null;

        } catch (Exception e) {
            log.error("Error fetching YouTube link for title '{}': {}", trimmedTitle, e.getMessage());
            return null;
        }
    }

    /**
     * Build ML Recommendation request from user data
     */
    private MLRecommendationRequest buildMLRecommendationRequest(UUID userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return null;
        }

        AcademicProfile academic = academicProfileRepository.findByUserId(userId).orElse(null);
        CareerProfile career = careerProfileRepository.findByUserId(userId).orElse(null);
        SkillProfile skills = skillProfileRepository.findByUserId(userId).orElse(null);

        // Get course and project statistics
        List<Course> courses = courseRepository.findByUserId(userId);
        List<Project> projects = projectRepository.findByUserId(userId);
        List<Certification> certifications = certificationRepository.findByUserId(userId);

        // Calculate averages
        double avgCourseGrade = courses.stream()
                .filter(c -> c.getGrade() != null)
                .mapToDouble(Course::getGrade)
                .average()
                .orElse(0.0);

        String avgProjectComplexity = calculateAverageComplexity(projects);

        // Get course names
        List<String> courseNames = courses.stream()
                .map(Course::getCourseName)
                .filter(Objects::nonNull)
                .toList();

        // Get certification names
        List<String> certificationNames = certifications.stream()
                .map(Certification::getCertificationName)
                .filter(Objects::nonNull)
                .toList();

        MLRecommendationRequest.MLRecommendationRequestBuilder builder = MLRecommendationRequest.builder()
                .userId(userId.toString())
                .numCourses(courses.size())
                .avgCourseGrade(avgCourseGrade)
                .coursesNames(courseNames)
                .numProjects(projects.size())
                .avgProjectComplexity(avgProjectComplexity)
                .numCertifications(certifications.size())
                .certificationNames(certificationNames);

        // Add academic profile data
        if (academic != null) {
            builder.educationLevel(getEducationLevelString(academic.getEducationLevel()))
                    .fieldOfStudy(academic.getFieldOfStudy())
                    .percentage(academic.getCgpaPercentage() != null ? academic.getCgpaPercentage().doubleValue() : null);
        }

        // Add career profile data
        if (career != null) {
            builder.targetSector(convertSectorToApiFormat(career.getIndustrySector()))
                    .targetRole(convertRoleToApiFormat(career.getTargetJobRole()));
        }

        // Add skill profile data
        if (skills != null) {
            builder.hasEhr(skills.getHasEhr())
                    .hasHl7Fhir(skills.getHasHl7Fhir())
                    .hasMedicalImaging(skills.getHasMedicalImaging())
                    .hasHealthcareSecurity(skills.getHasHealthcareSecurity())
                    .hasTelemedicine(skills.getHasTelemedicine())
                    .hasIotSensors(skills.getHasIotSensors())
                    .hasDroneOps(skills.getHasDroneOps())
                    .hasPrecisionAg(skills.getHasPrecisionAg())
                    .hasCropModeling(skills.getHasCropModeling())
                    .hasSoilAnalysis(skills.getHasSoilAnalysis())
                    .hasGis(skills.getHasGis())
                    .hasSmartGrid(skills.getHasSmartGrid())
                    .hasTrafficMgmt(skills.getHasTrafficMgmt())
                    .hasUrbanIot(skills.getHasUrbanIot())
                    .hasBuildingAuto(skills.getHasBuildingAuto())
                    .hasCommunication(skills.getHasCommunication())
                    .hasTeamwork(skills.getHasTeamwork())
                    .hasProblemSolving(skills.getHasProblemSolving())
                    .hasLeadership(skills.getHasLeadership());
        }

        return builder.build();
    }

    /**
     * Build Skill Predict request from user data
     */
    private SkillPredictRequest buildSkillPredictRequest(UUID userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return null;
        }

        AcademicProfile academic = academicProfileRepository.findByUserId(userId).orElse(null);
        CareerProfile career = careerProfileRepository.findByUserId(userId).orElse(null);
        SkillProfile skills = skillProfileRepository.findByUserId(userId).orElse(null);

        // Get course and project statistics
        List<Course> courses = courseRepository.findByUserId(userId);
        List<Project> projects = projectRepository.findByUserId(userId);
        List<Certification> certifications = certificationRepository.findByUserId(userId);

        // Calculate averages
        double avgCourseGrade = courses.stream()
                .filter(c -> c.getGrade() != null)
                .mapToDouble(Course::getGrade)
                .average()
                .orElse(0.0);

        double avgProjectComplexity = calculateAverageComplexityNumeric(projects);

        SkillPredictRequest.SkillPredictRequestBuilder builder = SkillPredictRequest.builder()
                .numCourses(courses.size())
                .avgCourseGrade(avgCourseGrade)
                .numProjects(projects.size())
                .avgProjectComplexity(avgProjectComplexity)
                .numCertifications(certifications.size());

        // Add academic profile data
        if (academic != null) {
            builder.educationLevel(academic.getEducationLevel())
                    .fieldOfStudy(encodeFieldOfStudy(academic.getFieldOfStudy()))
                    .percentage(academic.getCgpaPercentage() != null ? academic.getCgpaPercentage().doubleValue() : null);
        }

        // Add career profile data
        if (career != null) {
            builder.targetSector(encodeSector(career.getIndustrySector()))
                    .targetRole(encodeRole(career.getTargetJobRole()));
        }

        // Add skill profile data (as integers 0/1)
        if (skills != null) {
            builder.hasEhr(boolToInt(skills.getHasEhr()))
                    .hasHl7Fhir(boolToInt(skills.getHasHl7Fhir()))
                    .hasMedicalImaging(boolToInt(skills.getHasMedicalImaging()))
                    .hasHealthcareSecurity(boolToInt(skills.getHasHealthcareSecurity()))
                    .hasTelemedicine(boolToInt(skills.getHasTelemedicine()))
                    .hasIotSensors(boolToInt(skills.getHasIotSensors()))
                    .hasDroneOps(boolToInt(skills.getHasDroneOps()))
                    .hasPrecisionAg(boolToInt(skills.getHasPrecisionAg()))
                    .hasCropModeling(boolToInt(skills.getHasCropModeling()))
                    .hasSoilAnalysis(boolToInt(skills.getHasSoilAnalysis()))
                    .hasGis(boolToInt(skills.getHasGis()))
                    .hasSmartGrid(boolToInt(skills.getHasSmartGrid()))
                    .hasTrafficMgmt(boolToInt(skills.getHasTrafficMgmt()))
                    .hasUrbanIot(boolToInt(skills.getHasUrbanIot()))
                    .hasBuildingAuto(boolToInt(skills.getHasBuildingAuto()))
                    .hasCommunication(boolToInt(skills.getHasCommunication()))
                    .hasTeamwork(boolToInt(skills.getHasTeamwork()))
                    .hasProblemSolving(boolToInt(skills.getHasProblemSolving()))
                    .hasLeadership(boolToInt(skills.getHasLeadership()));
        }

        return builder.build();
    }

    // Helper methods

    private String getEducationLevelString(Integer level) {
        if (level == null) return "bachelors";
        return switch (level) {
            case 1 -> "high_school";
            case 2 -> "bachelors";
            case 3 -> "masters";
            case 4 -> "phd";
            default -> "bachelors";
        };
    }

    private String convertSectorToApiFormat(String sector) {
        if (sector == null) return "healthcare_technology";
        return switch (sector.toLowerCase()) {
            case "healthcare", "healthcare technology", "health" -> "healthcare_technology";
            case "agriculture", "agricultural sciences", "agri" -> "agricultural_sciences";
            case "urban", "smart city", "urban systems" -> "urban_smart_city";
            default -> "healthcare_technology";
        };
    }

    private String convertRoleToApiFormat(String role) {
        if (role == null) return "health_data_analyst";
        
        // Map frontend role names to Model 2's expected role IDs
        String lowerRole = role.toLowerCase().trim();
        
        // Healthcare roles mapping
        if (lowerRole.contains("health data analyst") || lowerRole.contains("healthcare data analyst")) {
            return "health_data_analyst";
        }
        if (lowerRole.contains("medical ai") || lowerRole.contains("healthcare ml") || lowerRole.contains("biomedical data")) {
            return "healthcare_ml_engineer";
        }
        if (lowerRole.contains("healthcare it") || lowerRole.contains("health systems")) {
            return "healthcare_it_manager";
        }
        if (lowerRole.contains("clinical informatics")) {
            return "clinical_informatics_specialist";
        }
        if (lowerRole.contains("telemedicine") || lowerRole.contains("telehealth")) {
            return "telemedicine_systems_engineer";
        }
        if (lowerRole.contains("digital health product") || lowerRole.contains("health product manager")) {
            return "healthcare_it_manager";
        }
        if (lowerRole.contains("medical imaging")) {
            return "medical_imaging_specialist";
        }
        if (lowerRole.contains("healthcare security") || lowerRole.contains("health security")) {
            return "healthcare_security_analyst";
        }
        if (lowerRole.contains("clinical data")) {
            return "clinical_data_specialist";
        }
        if (lowerRole.contains("population health")) {
            return "population_health_analyst";
        }
        
        // Agriculture roles mapping
        if (lowerRole.contains("agritech") || lowerRole.contains("agri tech") || lowerRole.contains("agri-tech")) {
            return "agritech_product_manager";
        }
        if (lowerRole.contains("precision farm") || lowerRole.contains("precision agriculture")) {
            return "precision_agriculture_specialist";
        }
        if (lowerRole.contains("agricultural data") || lowerRole.contains("agri data")) {
            return "agricultural_data_scientist";
        }
        if (lowerRole.contains("drone") || lowerRole.contains("uav")) {
            return "farm_automation_engineer";
        }
        if (lowerRole.contains("smart farm") || lowerRole.contains("farm automation")) {
            return "farm_automation_engineer";
        }
        if (lowerRole.contains("iot agriculture") || lowerRole.contains("agricultural iot")) {
            return "agricultural_iot_specialist";
        }
        if (lowerRole.contains("crop analytics") || lowerRole.contains("crop analysis")) {
            return "crop_analytics_specialist";
        }
        if (lowerRole.contains("sustainable agriculture") || lowerRole.contains("soil")) {
            return "soil_health_data_analyst";
        }
        if (lowerRole.contains("irrigation") || lowerRole.contains("water")) {
            return "smart_irrigation_engineer";
        }
        if (lowerRole.contains("agricultural robot") || lowerRole.contains("agri robot")) {
            return "agricultural_robotics_engineer";
        }
        
        // Urban/Smart City roles mapping
        if (lowerRole.contains("smart city architect") || lowerRole.contains("city solutions")) {
            return "smart_city_solutions_architect";
        }
        if (lowerRole.contains("iot solutions") || lowerRole.contains("iot infrastructure")) {
            return "iot_infrastructure_engineer";
        }
        if (lowerRole.contains("urban systems") || lowerRole.contains("urban data") || lowerRole.contains("urban analyst")) {
            return "urban_data_analyst";
        }
        if (lowerRole.contains("smart grid") || lowerRole.contains("energy")) {
            return "smart_grid_engineer";
        }
        if (lowerRole.contains("traffic")) {
            return "traffic_management_systems_engineer";
        }
        if (lowerRole.contains("gis analyst") || lowerRole.contains("geospatial")) {
            return "urban_gis_specialist";
        }
        if (lowerRole.contains("building automation") || lowerRole.contains("smart building")) {
            return "building_automation_engineer";
        }
        
        // Default fallback based on sector context (if no specific match)
        return lowerRole.replace(" ", "_");
    }

    private Integer encodeFieldOfStudy(String fieldOfStudy) {
        if (fieldOfStudy == null) return 0;
        return switch (fieldOfStudy.toLowerCase()) {
            case "computer science" -> 1;
            case "information technology" -> 2;
            case "healthcare", "health sciences" -> 3;
            case "agriculture" -> 4;
            case "engineering" -> 5;
            case "business" -> 6;
            default -> 0;
        };
    }

    private Integer encodeSector(String sector) {
        if (sector == null) return 0;
        return switch (sector.toLowerCase()) {
            case "healthcare", "healthcare_technology" -> 1;
            case "agriculture", "agriculture_technology" -> 2;
            case "urban", "smart_city" -> 3;
            default -> 0;
        };
    }

    private Integer encodeRole(String role) {
        if (role == null) return 0;
        // Simple hash-based encoding for roles
        return Math.abs(role.toLowerCase().hashCode() % 10) + 1;
    }

    private Integer boolToInt(Boolean value) {
        return value != null && value ? 1 : 0;
    }

    private String calculateAverageComplexity(List<Project> projects) {
        if (projects == null || projects.isEmpty()) {
            return "Low";
        }
        double avg = projects.stream()
                .filter(p -> p.getComplexityLevel() != null)
                .mapToDouble(Project::getComplexityLevel)
                .average()
                .orElse(1.0);
        
        if (avg < 1.5) return "Low";
        if (avg < 2.5) return "Medium";
        return "High";
    }

    private double calculateAverageComplexityNumeric(List<Project> projects) {
        if (projects == null || projects.isEmpty()) {
            return 1.0;
        }
        return projects.stream()
                .filter(p -> p.getComplexityLevel() != null)
                .mapToDouble(Project::getComplexityLevel)
                .average()
                .orElse(1.0);
    }
}
