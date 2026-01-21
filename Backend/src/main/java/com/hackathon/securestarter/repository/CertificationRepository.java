package com.hackathon.securestarter.repository;

import com.hackathon.securestarter.entity.Certification;
import com.hackathon.securestarter.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for Certification entity operations.
 * Provides data access methods for certification management.
 */
@Repository
public interface CertificationRepository extends JpaRepository<Certification, UUID> {

    /**
     * Find all certifications by user
     * @param user the user entity
     * @return List of certifications for the user
     */
    List<Certification> findByUser(User user);

    /**
     * Find all certifications by user ID
     * @param userId the user's UUID
     * @return List of certifications for the user
     */
    List<Certification> findByUserId(UUID userId);

    /**
     * Find all certifications by user ordered by created date descending
     * @param userId the user's UUID
     * @return List of certifications ordered by newest first
     */
    List<Certification> findByUserIdOrderByCreatedAtDesc(UUID userId);

    /**
     * Count total certifications for a user
     * @param userId the user's UUID
     * @return count of certifications
     */
    long countByUserId(UUID userId);

    /**
     * Find certification by ID and user ID (for ownership verification)
     * @param id certification UUID
     * @param userId user UUID
     * @return Optional containing the certification if found and owned by user
     */
    Optional<Certification> findByIdAndUserId(UUID id, UUID userId);

    /**
     * Delete all certifications by user
     * @param user the user entity
     */
    void deleteByUser(User user);

    /**
     * Delete all certifications by user ID
     * @param userId the user's UUID
     */
    void deleteByUserId(UUID userId);
}
