package com.hackathon.securestarter.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Career Profile creation/update requests.
 * Contains validation rules for career data.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CareerProfileRequest {

    @NotBlank(message = "Industry sector is required")
    @Pattern(regexp = "^(Healthcare|Agriculture|Urban)$", 
             message = "Industry sector must be Healthcare, Agriculture, or Urban")
    private String industrySector;

    @NotBlank(message = "Target job role is required")
    @Size(max = 200, message = "Target job role cannot exceed 200 characters")
    private String targetJobRole;

    @Size(max = 1000, message = "Career goals cannot exceed 1000 characters")
    private String careerGoals;
}
