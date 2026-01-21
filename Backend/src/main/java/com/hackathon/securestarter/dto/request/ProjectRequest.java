package com.hackathon.securestarter.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Project creation/update requests.
 * Contains validation rules for project data.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectRequest {

    @NotBlank(message = "Project title is required")
    @Size(max = 300, message = "Project title cannot exceed 300 characters")
    private String projectTitle;

    @NotBlank(message = "Domain skills are required")
    @Size(max = 500, message = "Domain skills cannot exceed 500 characters")
    private String domainSkills; // Comma-separated skills used in project

    @NotNull(message = "Complexity level is required")
    @Min(value = 1, message = "Complexity level must be at least 1")
    @Max(value = 3, message = "Complexity level must be at most 3")
    private Integer complexityLevel; // 1=Beginner, 2=Intermediate, 3=Advanced

    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;

    @Size(max = 500, message = "GitHub URL cannot exceed 500 characters")
    @Pattern(regexp = "^(https?://)?(www\\.)?github\\.com/.*$|^$", 
             message = "GitHub URL must be a valid GitHub link")
    private String githubUrl;

    @Size(max = 500, message = "Demo URL cannot exceed 500 characters")
    private String demoUrl;
}
