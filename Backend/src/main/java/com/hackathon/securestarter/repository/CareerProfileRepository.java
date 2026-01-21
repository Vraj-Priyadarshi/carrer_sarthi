package com.hackathon.securestarter.repository;

import com.hackathon.securestarter.entity.CareerProfile;
import com.hackathon.securestarter.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for CareerProfile entity operations.
 * Provides data access methods for career profile management.
 */
@Repository
public interface CareerProfileRepository extends JpaRepository<CareerProfile, UUID> {

    /**
     * Find career profile by user
     * @param user the user entity
     * @return Optional containing the career profile if found
     */
    Optional<CareerProfile> findByUser(User user);

    /**
     * Find career profile by user ID
     * @param userId the user's UUID
     * @return Optional containing the career profile if found
     */
    Optional<CareerProfile> findByUserId(UUID userId);

    /**
     * Check if career profile exists for user
     * @param userId the user's UUID
     * @return true if profile exists, false otherwise
     */
    boolean existsByUserId(UUID userId);

    /**
     * Find all users targeting a specific industry sector
     * @param industrySector the industry sector (Healthcare, Agriculture, Urban)
     * @return List of career profiles in that sector
     */
    List<CareerProfile> findByIndustrySector(String industrySector);

    /**
     * Delete career profile by user
     * @param user the user entity
     */
    void deleteByUser(User user);
}
