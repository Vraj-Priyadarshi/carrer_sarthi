package com.hackathon.securestarter.service;

import com.hackathon.securestarter.dto.request.ProjectRequest;
import com.hackathon.securestarter.dto.response.ProjectListResponse;
import com.hackathon.securestarter.dto.response.ProjectResponse;
import com.hackathon.securestarter.entity.Project;
import com.hackathon.securestarter.entity.User;
import com.hackathon.securestarter.exception.ResourceNotFoundException;
import com.hackathon.securestarter.repository.ProjectRepository;
import com.hackathon.securestarter.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for managing Project operations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    /**
     * Get all projects for a user with statistics
     * @param userId the user's UUID
     * @return ProjectListResponse with projects and stats
     */
    public ProjectListResponse getUserProjects(UUID userId) {
        List<Project> projects = projectRepository.findByUserIdOrderByCreatedAtDesc(userId);
        List<ProjectResponse> projectResponses = projects.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        Double avgComplexity = projectRepository.findAverageComplexityByUserId(userId);
        
        int beginnerCount = (int) projects.stream()
                .filter(p -> p.getComplexityLevel() != null && p.getComplexityLevel() == 1)
                .count();
        int intermediateCount = (int) projects.stream()
                .filter(p -> p.getComplexityLevel() != null && p.getComplexityLevel() == 2)
                .count();
        int advancedCount = (int) projects.stream()
                .filter(p -> p.getComplexityLevel() != null && p.getComplexityLevel() == 3)
                .count();

        return ProjectListResponse.builder()
                .projects(projectResponses)
                .totalProjects(projects.size())
                .averageComplexity(avgComplexity != null ? Math.round(avgComplexity * 100.0) / 100.0 : 0.0)
                .beginnerProjects(beginnerCount)
                .intermediateProjects(intermediateCount)
                .advancedProjects(advancedCount)
                .experienceLevel(ProjectListResponse.calculateExperienceLevel(avgComplexity))
                .build();
    }

    /**
     * Add a new project for a user
     * @param userId the user's UUID
     * @param request the project data
     * @return ProjectResponse
     */
    @Transactional
    public ProjectResponse addProject(UUID userId, ProjectRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Project project = Project.builder()
                .user(user)
                .projectTitle(request.getProjectTitle())
                .domainSkills(request.getDomainSkills())
                .complexityLevel(request.getComplexityLevel())
                .description(request.getDescription())
                .githubUrl(request.getGithubUrl())
                .demoUrl(request.getDemoUrl())
                .build();

        Project savedProject = projectRepository.save(project);
        log.info("Project added for user: {} - {}", user.getEmail(), project.getProjectTitle());

        return mapToResponse(savedProject);
    }

    /**
     * Update an existing project
     * @param userId the user's UUID
     * @param projectId the project UUID
     * @param request the updated project data
     * @return ProjectResponse
     */
    @Transactional
    public ProjectResponse updateProject(UUID userId, UUID projectId, ProjectRequest request) {
        Project project = projectRepository.findByIdAndUserId(projectId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found or not owned by user"));

        project.setProjectTitle(request.getProjectTitle());
        project.setDomainSkills(request.getDomainSkills());
        project.setComplexityLevel(request.getComplexityLevel());
        project.setDescription(request.getDescription());
        project.setGithubUrl(request.getGithubUrl());
        project.setDemoUrl(request.getDemoUrl());

        Project savedProject = projectRepository.save(project);
        log.info("Project updated: {}", project.getProjectTitle());

        return mapToResponse(savedProject);
    }

    /**
     * Delete a project
     * @param userId the user's UUID
     * @param projectId the project UUID
     */
    @Transactional
    public void deleteProject(UUID userId, UUID projectId) {
        Project project = projectRepository.findByIdAndUserId(projectId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found or not owned by user"));

        projectRepository.delete(project);
        log.info("Project deleted: {}", project.getProjectTitle());
    }

    /**
     * Get project count for a user
     * @param userId the user's UUID
     * @return count of projects
     */
    public long getProjectCount(UUID userId) {
        return projectRepository.countByUserId(userId);
    }

    /**
     * Get average complexity for a user
     * @param userId the user's UUID
     * @return average complexity or 0 if no projects
     */
    public Double getAverageComplexity(UUID userId) {
        Double avg = projectRepository.findAverageComplexityByUserId(userId);
        return avg != null ? avg : 0.0;
    }

    /**
     * Create project from request (internal use for onboarding)
     * @param user the user entity
     * @param request the project request
     * @return saved Project entity
     */
    @Transactional
    public Project createProjectEntity(User user, ProjectRequest request) {
        Project project = Project.builder()
                .user(user)
                .projectTitle(request.getProjectTitle())
                .domainSkills(request.getDomainSkills())
                .complexityLevel(request.getComplexityLevel())
                .description(request.getDescription())
                .githubUrl(request.getGithubUrl())
                .demoUrl(request.getDemoUrl())
                .build();

        return projectRepository.save(project);
    }

    /**
     * Create multiple projects for onboarding
     * @param user the user entity
     * @param requests list of project requests
     * @return list of saved projects
     */
    @Transactional
    public List<Project> createProjectsForUser(User user, List<ProjectRequest> requests) {
        return requests.stream()
                .map(req -> createProjectEntity(user, req))
                .collect(Collectors.toList());
    }

    /**
     * Map entity to response DTO
     */
    private ProjectResponse mapToResponse(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .projectTitle(project.getProjectTitle())
                .domainSkills(project.getDomainSkills())
                .complexityLevel(project.getComplexityLevel())
                .complexityDescription(ProjectResponse.getComplexityDescription(project.getComplexityLevel()))
                .description(project.getDescription())
                .githubUrl(project.getGithubUrl())
                .demoUrl(project.getDemoUrl())
                .updatedAt(project.getUpdatedAt())
                .createdAt(project.getCreatedAt())
                .build();
    }
}
