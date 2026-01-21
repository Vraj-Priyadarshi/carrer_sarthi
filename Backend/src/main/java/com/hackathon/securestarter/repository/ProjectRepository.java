package com.hackathon.securestarter.repository;

import com.hackathon.securestarter.entity.Project;
import com.hackathon.securestarter.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for Project entity operations.
 * Provides data access methods for project management.
 */
@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {

    /**
     * Find all projects by user
     * @param user the user entity
     * @return List of projects for the user
     */
    List<Project> findByUser(User user);

    /**
     * Find all projects by user ID
     * @param userId the user's UUID
     * @return List of projects for the user
     */
    List<Project> findByUserId(UUID userId);

    /**
     * Find all projects by user ordered by creation date descending
     * @param userId the user's UUID
     * @return List of projects ordered by newest first
     */
    List<Project> findByUserIdOrderByCreatedAtDesc(UUID userId);

    /**
     * Count total projects for a user
     * @param userId the user's UUID
     * @return count of projects
     */
    long countByUserId(UUID userId);

    /**
     * Calculate average complexity for a user's projects
     * @param userId the user's UUID
     * @return average complexity or null if no projects
     */
    @Query("SELECT AVG(p.complexityLevel) FROM Project p WHERE p.user.id = :userId")
    Double findAverageComplexityByUserId(@Param("userId") UUID userId);

    /**
     * Find project by ID and user ID (for ownership verification)
     * @param id project UUID
     * @param userId user UUID
     * @return Optional containing the project if found and owned by user
     */
    Optional<Project> findByIdAndUserId(UUID id, UUID userId);

    /**
     * Find projects by complexity level for a user
     * @param userId the user's UUID
     * @param complexityLevel complexity level (1-3)
     * @return List of projects with specified complexity
     */
    List<Project> findByUserIdAndComplexityLevel(UUID userId, Integer complexityLevel);

    /**
     * Delete all projects by user
     * @param user the user entity
     */
    void deleteByUser(User user);

    /**
     * Delete all projects by user ID
     * @param userId the user's UUID
     */
    void deleteByUserId(UUID userId);
}
