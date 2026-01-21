package com.hackathon.securestarter.service;

import com.hackathon.securestarter.dto.request.CourseRequest;
import com.hackathon.securestarter.dto.response.CourseListResponse;
import com.hackathon.securestarter.dto.response.CourseResponse;
import com.hackathon.securestarter.entity.Course;
import com.hackathon.securestarter.entity.User;
import com.hackathon.securestarter.exception.ResourceNotFoundException;
import com.hackathon.securestarter.repository.CourseRepository;
import com.hackathon.securestarter.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for managing Course operations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    /**
     * Get all courses for a user with statistics
     * @param userId the user's UUID
     * @return CourseListResponse with courses and stats
     */
    public CourseListResponse getUserCourses(UUID userId) {
        List<Course> courses = courseRepository.findByUserIdOrderByCreatedAtDesc(userId);
        List<CourseResponse> courseResponses = courses.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        Double avgGrade = courseRepository.findAverageGradeByUserId(userId);
        int highGradeCount = (int) courses.stream()
                .filter(c -> c.getGrade() != null && c.getGrade() >= 90)
                .count();

        return CourseListResponse.builder()
                .courses(courseResponses)
                .totalCourses(courses.size())
                .averageGrade(avgGrade != null ? Math.round(avgGrade * 100.0) / 100.0 : 0.0)
                .highestGradeCourseCount(highGradeCount)
                .performanceLevel(CourseListResponse.calculatePerformanceLevel(avgGrade))
                .build();
    }

    /**
     * Add a new course for a user
     * @param userId the user's UUID
     * @param request the course data
     * @return CourseResponse
     */
    @Transactional
    public CourseResponse addCourse(UUID userId, CourseRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Course course = Course.builder()
                .user(user)
                .courseName(request.getCourseName())
                .grade(request.getGrade())
                .platform(request.getPlatform())
                .completionDate(request.getCompletionDate())
                .build();

        Course savedCourse = courseRepository.save(course);
        log.info("Course added for user: {} - {}", user.getEmail(), course.getCourseName());

        return mapToResponse(savedCourse);
    }

    /**
     * Update an existing course
     * @param userId the user's UUID
     * @param courseId the course UUID
     * @param request the updated course data
     * @return CourseResponse
     */
    @Transactional
    public CourseResponse updateCourse(UUID userId, UUID courseId, CourseRequest request) {
        Course course = courseRepository.findByIdAndUserId(courseId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found or not owned by user"));

        course.setCourseName(request.getCourseName());
        course.setGrade(request.getGrade());
        course.setPlatform(request.getPlatform());
        course.setCompletionDate(request.getCompletionDate());

        Course savedCourse = courseRepository.save(course);
        log.info("Course updated: {}", course.getCourseName());

        return mapToResponse(savedCourse);
    }

    /**
     * Delete a course
     * @param userId the user's UUID
     * @param courseId the course UUID
     */
    @Transactional
    public void deleteCourse(UUID userId, UUID courseId) {
        Course course = courseRepository.findByIdAndUserId(courseId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found or not owned by user"));

        courseRepository.delete(course);
        log.info("Course deleted: {}", course.getCourseName());
    }

    /**
     * Get course count for a user
     * @param userId the user's UUID
     * @return count of courses
     */
    public long getCourseCount(UUID userId) {
        return courseRepository.countByUserId(userId);
    }

    /**
     * Get average grade for a user
     * @param userId the user's UUID
     * @return average grade or 0 if no courses
     */
    public Double getAverageGrade(UUID userId) {
        Double avg = courseRepository.findAverageGradeByUserId(userId);
        return avg != null ? avg : 0.0;
    }

    /**
     * Create course from request (internal use for onboarding)
     * @param user the user entity
     * @param request the course request
     * @return saved Course entity
     */
    @Transactional
    public Course createCourseEntity(User user, CourseRequest request) {
        Course course = Course.builder()
                .user(user)
                .courseName(request.getCourseName())
                .grade(request.getGrade())
                .platform(request.getPlatform())
                .completionDate(request.getCompletionDate())
                .build();

        return courseRepository.save(course);
    }

    /**
     * Create multiple courses for onboarding
     * @param user the user entity
     * @param requests list of course requests
     * @return list of saved courses
     */
    @Transactional
    public List<Course> createCoursesForUser(User user, List<CourseRequest> requests) {
        return requests.stream()
                .map(req -> createCourseEntity(user, req))
                .collect(Collectors.toList());
    }

    /**
     * Map entity to response DTO
     */
    private CourseResponse mapToResponse(Course course) {
        return CourseResponse.builder()
                .id(course.getId())
                .courseName(course.getCourseName())
                .grade(course.getGrade())
                .platform(course.getPlatform())
                .completionDate(course.getCompletionDate())
                .updatedAt(course.getUpdatedAt())
                .createdAt(course.getCreatedAt())
                .build();
    }
}
