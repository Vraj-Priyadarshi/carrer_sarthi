package com.hackathon.securestarter.service;

import com.hackathon.securestarter.dto.request.SkillProfileRequest;
import com.hackathon.securestarter.dto.response.SkillProfileResponse;
import com.hackathon.securestarter.entity.SkillProfile;
import com.hackathon.securestarter.entity.User;
import com.hackathon.securestarter.exception.ResourceNotFoundException;
import com.hackathon.securestarter.repository.SkillProfileRepository;
import com.hackathon.securestarter.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Service for managing Skill Profile operations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SkillProfileService {

    private final SkillProfileRepository skillProfileRepository;
    private final UserRepository userRepository;

    /**
     * Get skill profile for a user
     * @param userId the user's UUID
     * @return SkillProfileResponse
     * @throws ResourceNotFoundException if profile not found
     */
    public SkillProfileResponse getSkillProfile(UUID userId) {
        SkillProfile profile = skillProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill profile not found for user"));

        return mapToResponse(profile);
    }

    /**
     * Create or update skill profile for a user
     * @param userId the user's UUID
     * @param request the profile data
     * @return SkillProfileResponse
     */
    @Transactional
    public SkillProfileResponse createOrUpdateSkillProfile(UUID userId, SkillProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        SkillProfile profile = skillProfileRepository.findByUserId(userId)
                .orElse(SkillProfile.builder().user(user).build());

        // Update Healthcare skills
        profile.setHasEhr(request.getHasEhr() != null ? request.getHasEhr() : false);
        profile.setHasHl7Fhir(request.getHasHl7Fhir() != null ? request.getHasHl7Fhir() : false);
        profile.setHasMedicalImaging(request.getHasMedicalImaging() != null ? request.getHasMedicalImaging() : false);
        profile.setHasHealthcareSecurity(request.getHasHealthcareSecurity() != null ? request.getHasHealthcareSecurity() : false);
        profile.setHasTelemedicine(request.getHasTelemedicine() != null ? request.getHasTelemedicine() : false);

        // Update Agriculture skills
        profile.setHasIotSensors(request.getHasIotSensors() != null ? request.getHasIotSensors() : false);
        profile.setHasDroneOps(request.getHasDroneOps() != null ? request.getHasDroneOps() : false);
        profile.setHasPrecisionAg(request.getHasPrecisionAg() != null ? request.getHasPrecisionAg() : false);
        profile.setHasCropModeling(request.getHasCropModeling() != null ? request.getHasCropModeling() : false);
        profile.setHasSoilAnalysis(request.getHasSoilAnalysis() != null ? request.getHasSoilAnalysis() : false);

        // Update Urban/Smart City skills
        profile.setHasGis(request.getHasGis() != null ? request.getHasGis() : false);
        profile.setHasSmartGrid(request.getHasSmartGrid() != null ? request.getHasSmartGrid() : false);
        profile.setHasTrafficMgmt(request.getHasTrafficMgmt() != null ? request.getHasTrafficMgmt() : false);
        profile.setHasUrbanIot(request.getHasUrbanIot() != null ? request.getHasUrbanIot() : false);
        profile.setHasBuildingAuto(request.getHasBuildingAuto() != null ? request.getHasBuildingAuto() : false);

        // Update Soft skills
        profile.setHasCommunication(request.getHasCommunication() != null ? request.getHasCommunication() : false);
        profile.setHasTeamwork(request.getHasTeamwork() != null ? request.getHasTeamwork() : false);
        profile.setHasProblemSolving(request.getHasProblemSolving() != null ? request.getHasProblemSolving() : false);
        profile.setHasLeadership(request.getHasLeadership() != null ? request.getHasLeadership() : false);

        SkillProfile savedProfile = skillProfileRepository.save(profile);
        log.info("Skill profile saved for user: {}", user.getEmail());

        return mapToResponse(savedProfile);
    }

    /**
     * Check if skill profile exists for user
     * @param userId the user's UUID
     * @return true if profile exists
     */
    public boolean hasSkillProfile(UUID userId) {
        return skillProfileRepository.existsByUserId(userId);
    }

    /**
     * Create skill profile from request (internal use for onboarding)
     * @param user the user entity
     * @param request the profile request
     * @return saved SkillProfile entity
     */
    @Transactional
    public SkillProfile createSkillProfileEntity(User user, SkillProfileRequest request) {
        SkillProfile profile = SkillProfile.builder()
                .user(user)
                // Healthcare
                .hasEhr(request.getHasEhr() != null ? request.getHasEhr() : false)
                .hasHl7Fhir(request.getHasHl7Fhir() != null ? request.getHasHl7Fhir() : false)
                .hasMedicalImaging(request.getHasMedicalImaging() != null ? request.getHasMedicalImaging() : false)
                .hasHealthcareSecurity(request.getHasHealthcareSecurity() != null ? request.getHasHealthcareSecurity() : false)
                .hasTelemedicine(request.getHasTelemedicine() != null ? request.getHasTelemedicine() : false)
                // Agriculture
                .hasIotSensors(request.getHasIotSensors() != null ? request.getHasIotSensors() : false)
                .hasDroneOps(request.getHasDroneOps() != null ? request.getHasDroneOps() : false)
                .hasPrecisionAg(request.getHasPrecisionAg() != null ? request.getHasPrecisionAg() : false)
                .hasCropModeling(request.getHasCropModeling() != null ? request.getHasCropModeling() : false)
                .hasSoilAnalysis(request.getHasSoilAnalysis() != null ? request.getHasSoilAnalysis() : false)
                // Urban
                .hasGis(request.getHasGis() != null ? request.getHasGis() : false)
                .hasSmartGrid(request.getHasSmartGrid() != null ? request.getHasSmartGrid() : false)
                .hasTrafficMgmt(request.getHasTrafficMgmt() != null ? request.getHasTrafficMgmt() : false)
                .hasUrbanIot(request.getHasUrbanIot() != null ? request.getHasUrbanIot() : false)
                .hasBuildingAuto(request.getHasBuildingAuto() != null ? request.getHasBuildingAuto() : false)
                // Soft Skills
                .hasCommunication(request.getHasCommunication() != null ? request.getHasCommunication() : false)
                .hasTeamwork(request.getHasTeamwork() != null ? request.getHasTeamwork() : false)
                .hasProblemSolving(request.getHasProblemSolving() != null ? request.getHasProblemSolving() : false)
                .hasLeadership(request.getHasLeadership() != null ? request.getHasLeadership() : false)
                .build();

        return skillProfileRepository.save(profile);
    }

    /**
     * Get skill profile entity by user ID (internal use)
     * @param userId the user's UUID
     * @return SkillProfile entity or null
     */
    public SkillProfile getSkillProfileEntity(UUID userId) {
        return skillProfileRepository.findByUserId(userId).orElse(null);
    }

    /**
     * Get list of skills user has based on industry sector
     * @param profile the skill profile
     * @param industrySector the industry sector
     * @return list of skill names
     */
    public List<String> getCurrentSkillsList(SkillProfile profile, String industrySector) {
        List<String> skills = new ArrayList<>();

        // Add relevant domain skills based on sector
        if (industrySector != null) {
            switch (industrySector) {
                case "Healthcare" -> addHealthcareSkills(profile, skills);
                case "Agriculture" -> addAgricultureSkills(profile, skills);
                case "Urban" -> addUrbanSkills(profile, skills);
            }
        }

        // Add soft skills
        addSoftSkills(profile, skills);

        return skills;
    }

    /**
     * Get all skills user has (regardless of sector)
     * @param profile the skill profile
     * @return list of all skill names
     */
    public List<String> getAllCurrentSkills(SkillProfile profile) {
        List<String> skills = new ArrayList<>();
        addHealthcareSkills(profile, skills);
        addAgricultureSkills(profile, skills);
        addUrbanSkills(profile, skills);
        addSoftSkills(profile, skills);
        return skills;
    }

    private void addHealthcareSkills(SkillProfile profile, List<String> skills) {
        if (Boolean.TRUE.equals(profile.getHasEhr())) skills.add("Electronic Health Records (EHR)");
        if (Boolean.TRUE.equals(profile.getHasHl7Fhir())) skills.add("HL7/FHIR Standards");
        if (Boolean.TRUE.equals(profile.getHasMedicalImaging())) skills.add("Medical Imaging");
        if (Boolean.TRUE.equals(profile.getHasHealthcareSecurity())) skills.add("Healthcare Security (HIPAA)");
        if (Boolean.TRUE.equals(profile.getHasTelemedicine())) skills.add("Telemedicine");
    }

    private void addAgricultureSkills(SkillProfile profile, List<String> skills) {
        if (Boolean.TRUE.equals(profile.getHasIotSensors())) skills.add("IoT Sensors");
        if (Boolean.TRUE.equals(profile.getHasDroneOps())) skills.add("Drone Operations");
        if (Boolean.TRUE.equals(profile.getHasPrecisionAg())) skills.add("Precision Agriculture");
        if (Boolean.TRUE.equals(profile.getHasCropModeling())) skills.add("Crop Modeling");
        if (Boolean.TRUE.equals(profile.getHasSoilAnalysis())) skills.add("Soil Analysis");
    }

    private void addUrbanSkills(SkillProfile profile, List<String> skills) {
        if (Boolean.TRUE.equals(profile.getHasGis())) skills.add("Geographic Information Systems (GIS)");
        if (Boolean.TRUE.equals(profile.getHasSmartGrid())) skills.add("Smart Grid");
        if (Boolean.TRUE.equals(profile.getHasTrafficMgmt())) skills.add("Traffic Management");
        if (Boolean.TRUE.equals(profile.getHasUrbanIot())) skills.add("Urban IoT");
        if (Boolean.TRUE.equals(profile.getHasBuildingAuto())) skills.add("Building Automation");
    }

    private void addSoftSkills(SkillProfile profile, List<String> skills) {
        if (Boolean.TRUE.equals(profile.getHasCommunication())) skills.add("Communication");
        if (Boolean.TRUE.equals(profile.getHasTeamwork())) skills.add("Teamwork");
        if (Boolean.TRUE.equals(profile.getHasProblemSolving())) skills.add("Problem Solving");
        if (Boolean.TRUE.equals(profile.getHasLeadership())) skills.add("Leadership");
    }

    /**
     * Count skills by category
     */
    public int countHealthcareSkills(SkillProfile profile) {
        int count = 0;
        if (Boolean.TRUE.equals(profile.getHasEhr())) count++;
        if (Boolean.TRUE.equals(profile.getHasHl7Fhir())) count++;
        if (Boolean.TRUE.equals(profile.getHasMedicalImaging())) count++;
        if (Boolean.TRUE.equals(profile.getHasHealthcareSecurity())) count++;
        if (Boolean.TRUE.equals(profile.getHasTelemedicine())) count++;
        return count;
    }

    public int countAgricultureSkills(SkillProfile profile) {
        int count = 0;
        if (Boolean.TRUE.equals(profile.getHasIotSensors())) count++;
        if (Boolean.TRUE.equals(profile.getHasDroneOps())) count++;
        if (Boolean.TRUE.equals(profile.getHasPrecisionAg())) count++;
        if (Boolean.TRUE.equals(profile.getHasCropModeling())) count++;
        if (Boolean.TRUE.equals(profile.getHasSoilAnalysis())) count++;
        return count;
    }

    public int countUrbanSkills(SkillProfile profile) {
        int count = 0;
        if (Boolean.TRUE.equals(profile.getHasGis())) count++;
        if (Boolean.TRUE.equals(profile.getHasSmartGrid())) count++;
        if (Boolean.TRUE.equals(profile.getHasTrafficMgmt())) count++;
        if (Boolean.TRUE.equals(profile.getHasUrbanIot())) count++;
        if (Boolean.TRUE.equals(profile.getHasBuildingAuto())) count++;
        return count;
    }

    public int countSoftSkills(SkillProfile profile) {
        int count = 0;
        if (Boolean.TRUE.equals(profile.getHasCommunication())) count++;
        if (Boolean.TRUE.equals(profile.getHasTeamwork())) count++;
        if (Boolean.TRUE.equals(profile.getHasProblemSolving())) count++;
        if (Boolean.TRUE.equals(profile.getHasLeadership())) count++;
        return count;
    }

    /**
     * Map entity to response DTO
     */
    private SkillProfileResponse mapToResponse(SkillProfile profile) {
        int healthcareCount = countHealthcareSkills(profile);
        int agricultureCount = countAgricultureSkills(profile);
        int urbanCount = countUrbanSkills(profile);
        int softCount = countSoftSkills(profile);

        return SkillProfileResponse.builder()
                .id(profile.getId())
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
                // Counts
                .healthcareSkillsCount(healthcareCount)
                .agricultureSkillsCount(agricultureCount)
                .urbanSkillsCount(urbanCount)
                .softSkillsCount(softCount)
                .totalSkillsCount(healthcareCount + agricultureCount + urbanCount + softCount)
                .updatedAt(profile.getUpdatedAt())
                .createdAt(profile.getCreatedAt())
                .build();
    }
}
