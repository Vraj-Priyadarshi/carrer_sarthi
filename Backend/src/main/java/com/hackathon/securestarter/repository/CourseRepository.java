package com.hackathon.securestarter.repository;

import com.hackathon.securestarter.entity.Course;
import com.hackathon.securestarter.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for Course entity operations.
 * Provides data access methods for course management.
 */
@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {

    /**
     * Find all courses by user
     * @param user the user entity
     * @return List of courses for the user
     */
    List<Course> findByUser(User user);

    /**
     * Find all courses by user ID
     * @param userId the user's UUID
     * @return List of courses for the user
     */
    List<Course> findByUserId(UUID userId);

    /**
     * Find all courses by user ordered by creation date descending
     * @param userId the user's UUID
     * @return List of courses ordered by newest first
     */
    List<Course> findByUserIdOrderByCreatedAtDesc(UUID userId);

    /**
     * Count total courses for a user
     * @param userId the user's UUID
     * @return count of courses
     */
    long countByUserId(UUID userId);

    /**
     * Calculate average grade for a user's courses
     * @param userId the user's UUID
     * @return average grade or null if no courses
     */
    @Query("SELECT AVG(c.grade) FROM Course c WHERE c.user.id = :userId")
    Double findAverageGradeByUserId(@Param("userId") UUID userId);

    /**
     * Find course by ID and user ID (for ownership verification)
     * @param id course UUID
     * @param userId user UUID
     * @return Optional containing the course if found and owned by user
     */
    Optional<Course> findByIdAndUserId(UUID id, UUID userId);

    /**
     * Delete all courses by user
     * @param user the user entity
     */
    void deleteByUser(User user);

    /**
     * Delete all courses by user ID
     * @param userId the user's UUID
     */
    void deleteByUserId(UUID userId);
}
