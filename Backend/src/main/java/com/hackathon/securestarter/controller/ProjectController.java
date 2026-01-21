package com.hackathon.securestarter.controller;

import com.hackathon.securestarter.dto.request.ProjectRequest;
import com.hackathon.securestarter.dto.response.MessageResponse;
import com.hackathon.securestarter.dto.response.ProjectListResponse;
import com.hackathon.securestarter.dto.response.ProjectResponse;
import com.hackathon.securestarter.entity.User;
import com.hackathon.securestarter.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * REST Controller for Project management operations.
 * Handles CRUD operations for user's projects.
 */
@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Slf4j
public class ProjectController {

    private final ProjectService projectService;

    /**
     * Get all projects for current user with statistics
     * GET /api/projects/me
     * @param currentUser authenticated user
     * @return ProjectListResponse with projects and stats
     */
    @GetMapping("/me")
    public ResponseEntity<ProjectListResponse> getUserProjects(
            @AuthenticationPrincipal User currentUser) {
        
        log.info("Get projects for user: {}", currentUser.getEmail());
        ProjectListResponse response = projectService.getUserProjects(currentUser.getId());
        return ResponseEntity.ok(response);
    }

    /**
     * Add a new project
     * POST /api/projects
     * @param request project data
     * @param currentUser authenticated user
     * @return ProjectResponse
     */
    @PostMapping
    public ResponseEntity<ProjectResponse> addProject(
            @Valid @RequestBody ProjectRequest request,
            @AuthenticationPrincipal User currentUser) {
        
        log.info("Add project for user: {} - {}", currentUser.getEmail(), request.getProjectTitle());
        ProjectResponse response = projectService.addProject(currentUser.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Update an existing project
     * PUT /api/projects/{id}
     * @param id project UUID
     * @param request updated project data
     * @param currentUser authenticated user
     * @return ProjectResponse
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> updateProject(
            @PathVariable UUID id,
            @Valid @RequestBody ProjectRequest request,
            @AuthenticationPrincipal User currentUser) {
        
        log.info("Update project {} for user: {}", id, currentUser.getEmail());
        ProjectResponse response = projectService.updateProject(currentUser.getId(), id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete a project
     * DELETE /api/projects/{id}
     * @param id project UUID
     * @param currentUser authenticated user
     * @return MessageResponse
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteProject(
            @PathVariable UUID id,
            @AuthenticationPrincipal User currentUser) {
        
        log.info("Delete project {} for user: {}", id, currentUser.getEmail());
        projectService.deleteProject(currentUser.getId(), id);
        return ResponseEntity.ok(MessageResponse.success("Project deleted successfully"));
    }
}
