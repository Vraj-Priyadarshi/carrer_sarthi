package com.hackathon.securestarter.service;

import com.hackathon.securestarter.dto.request.CertificationRequest;
import com.hackathon.securestarter.dto.response.CertificationListResponse;
import com.hackathon.securestarter.dto.response.CertificationResponse;
import com.hackathon.securestarter.entity.Certification;
import com.hackathon.securestarter.entity.User;
import com.hackathon.securestarter.exception.ResourceNotFoundException;
import com.hackathon.securestarter.repository.CertificationRepository;
import com.hackathon.securestarter.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for managing Certification operations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CertificationService {

    private final CertificationRepository certificationRepository;
    private final UserRepository userRepository;

    /**
     * Get all certifications for a user with statistics
     * @param userId the user's UUID
     * @return CertificationListResponse with certifications and stats
     */
    public CertificationListResponse getUserCertifications(UUID userId) {
        List<Certification> certifications = certificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        List<CertificationResponse> certResponses = certifications.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return CertificationListResponse.builder()
                .certifications(certResponses)
                .totalCertifications(certifications.size())
                .activeCertifications(certifications.size())
                .expiredCertifications(0)
                .build();
    }

    /**
     * Add a new certification for a user
     * @param userId the user's UUID
     * @param request the certification data
     * @return CertificationResponse
     */
    @Transactional
    public CertificationResponse addCertification(UUID userId, CertificationRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Certification certification = Certification.builder()
                .user(user)
                .certificationName(request.getCertificationName())
                .build();

        Certification savedCertification = certificationRepository.save(certification);
        log.info("Certification added for user: {} - {}", user.getEmail(), certification.getCertificationName());

        return mapToResponse(savedCertification);
    }

    /**
     * Delete a certification
     * @param userId the user's UUID
     * @param certificationId the certification UUID
     */
    @Transactional
    public void deleteCertification(UUID userId, UUID certificationId) {
        Certification certification = certificationRepository.findByIdAndUserId(certificationId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Certification not found or not owned by user"));

        certificationRepository.delete(certification);
        log.info("Certification deleted: {}", certification.getCertificationName());
    }

    /**
     * Get certification count for a user
     * @param userId the user's UUID
     * @return count of certifications
     */
    public long getCertificationCount(UUID userId) {
        return certificationRepository.countByUserId(userId);
    }

    /**
     * Get active (non-expired) certification count for a user
     * @param userId the user's UUID
     * @return count of active certifications (all certifications since we don't track expiry)
     */
    public long getActiveCertificationCount(UUID userId) {
        return certificationRepository.countByUserId(userId);
    }

    /**
     * Create certification from request (internal use for onboarding)
     * @param user the user entity
     * @param request the certification request
     * @return saved Certification entity
     */
    @Transactional
    public Certification createCertificationEntity(User user, CertificationRequest request) {
        Certification certification = Certification.builder()
                .user(user)
                .certificationName(request.getCertificationName())
                .build();

        return certificationRepository.save(certification);
    }

    /**
     * Create multiple certifications for onboarding
     * @param user the user entity
     * @param requests list of certification requests
     * @return list of saved certifications
     */
    @Transactional
    public List<Certification> createCertificationsForUser(User user, List<CertificationRequest> requests) {
        return requests.stream()
                .map(req -> createCertificationEntity(user, req))
                .collect(Collectors.toList());
    }

    /**
     * Map entity to response DTO
     */
    private CertificationResponse mapToResponse(Certification certification) {
        return CertificationResponse.builder()
                .id(certification.getId())
                .certificationName(certification.getCertificationName())
                .createdAt(certification.getCreatedAt())
                .build();
    }
}
