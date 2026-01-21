package com.hackathon.securestarter.repository;

import com.hackathon.securestarter.entity.AcademicProfile;
import com.hackathon.securestarter.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository for AcademicProfile entity operations.
 * Provides data access methods for academic profile management.
 */
@Repository
public interface AcademicProfileRepository extends JpaRepository<AcademicProfile, UUID> {

    /**
     * Find academic profile by user
     * @param user the user entity
     * @return Optional containing the academic profile if found
     */
    Optional<AcademicProfile> findByUser(User user);

    /**
     * Find academic profile by user ID
     * @param userId the user's UUID
     * @return Optional containing the academic profile if found
     */
    Optional<AcademicProfile> findByUserId(UUID userId);

    /**
     * Check if academic profile exists for user
     * @param userId the user's UUID
     * @return true if profile exists, false otherwise
     */
    boolean existsByUserId(UUID userId);

    /**
     * Delete academic profile by user
     * @param user the user entity
     */
    void deleteByUser(User user);
}
