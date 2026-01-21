package com.hackathon.securestarter.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO for Course creation/update requests.
 * Contains validation rules for course data.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseRequest {

    @NotBlank(message = "Course name is required")
    @Size(max = 300, message = "Course name cannot exceed 300 characters")
    private String courseName;

    @NotNull(message = "Grade is required")
    @DecimalMin(value = "0.0", message = "Grade must be at least 0")
    @DecimalMax(value = "100.0", message = "Grade must be at most 100")
    private Float grade;

    @Size(max = 100, message = "Platform cannot exceed 100 characters")
    private String platform; // e.g., Coursera, Udemy, University

    private LocalDate completionDate;
}
