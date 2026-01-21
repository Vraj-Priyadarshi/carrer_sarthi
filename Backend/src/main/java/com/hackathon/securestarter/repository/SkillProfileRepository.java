package com.hackathon.securestarter.repository;

import com.hackathon.securestarter.entity.SkillProfile;
import com.hackathon.securestarter.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository for SkillProfile entity operations.
 * Provides data access methods for skill profile management.
 */
@Repository
public interface SkillProfileRepository extends JpaRepository<SkillProfile, UUID> {

    /**
     * Find skill profile by user
     * @param user the user entity
     * @return Optional containing the skill profile if found
     */
    Optional<SkillProfile> findByUser(User user);

    /**
     * Find skill profile by user ID
     * @param userId the user's UUID
     * @return Optional containing the skill profile if found
     */
    Optional<SkillProfile> findByUserId(UUID userId);

    /**
     * Check if skill profile exists for user
     * @param userId the user's UUID
     * @return true if profile exists, false otherwise
     */
    boolean existsByUserId(UUID userId);

    /**
     * Delete skill profile by user
     * @param user the user entity
     */
    void deleteByUser(User user);
}
