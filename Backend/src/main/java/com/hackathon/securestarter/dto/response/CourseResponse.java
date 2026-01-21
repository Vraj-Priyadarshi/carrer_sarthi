package com.hackathon.securestarter.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Response DTO for a single Course.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseResponse {

    private UUID id;
    private String courseName;
    private Float grade;
    private String platform;
    private LocalDate completionDate;
    private LocalDateTime updatedAt;
    private LocalDateTime createdAt;
}
