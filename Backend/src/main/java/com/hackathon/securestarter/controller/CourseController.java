package com.hackathon.securestarter.controller;

import com.hackathon.securestarter.dto.request.CourseRequest;
import com.hackathon.securestarter.dto.response.CourseListResponse;
import com.hackathon.securestarter.dto.response.CourseResponse;
import com.hackathon.securestarter.dto.response.MessageResponse;
import com.hackathon.securestarter.entity.User;
import com.hackathon.securestarter.service.CourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * REST Controller for Course management operations.
 * Handles CRUD operations for user's courses.
 */
@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
@Slf4j
public class CourseController {

    private final CourseService courseService;

    /**
     * Get all courses for current user with statistics
     * GET /api/courses/me
     * @param currentUser authenticated user
     * @return CourseListResponse with courses and stats
     */
    @GetMapping("/me")
    public ResponseEntity<CourseListResponse> getUserCourses(
            @AuthenticationPrincipal User currentUser) {
        
        log.info("Get courses for user: {}", currentUser.getEmail());
        CourseListResponse response = courseService.getUserCourses(currentUser.getId());
        return ResponseEntity.ok(response);
    }

    /**
     * Add a new course
     * POST /api/courses
     * @param request course data
     * @param currentUser authenticated user
     * @return CourseResponse
     */
    @PostMapping
    public ResponseEntity<CourseResponse> addCourse(
            @Valid @RequestBody CourseRequest request,
            @AuthenticationPrincipal User currentUser) {
        
        log.info("Add course for user: {} - {}", currentUser.getEmail(), request.getCourseName());
        CourseResponse response = courseService.addCourse(currentUser.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Update an existing course
     * PUT /api/courses/{id}
     * @param id course UUID
     * @param request updated course data
     * @param currentUser authenticated user
     * @return CourseResponse
     */
    @PutMapping("/{id}")
    public ResponseEntity<CourseResponse> updateCourse(
            @PathVariable UUID id,
            @Valid @RequestBody CourseRequest request,
            @AuthenticationPrincipal User currentUser) {
        
        log.info("Update course {} for user: {}", id, currentUser.getEmail());
        CourseResponse response = courseService.updateCourse(currentUser.getId(), id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete a course
     * DELETE /api/courses/{id}
     * @param id course UUID
     * @param currentUser authenticated user
     * @return MessageResponse
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteCourse(
            @PathVariable UUID id,
            @AuthenticationPrincipal User currentUser) {
        
        log.info("Delete course {} for user: {}", id, currentUser.getEmail());
        courseService.deleteCourse(currentUser.getId(), id);
        return ResponseEntity.ok(MessageResponse.success("Course deleted successfully"));
    }
}
