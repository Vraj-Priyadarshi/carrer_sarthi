package com.hackathon.securestarter.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Response DTO for Career Profile data.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CareerProfileResponse {

    private UUID id;
    private String industrySector;
    private String targetJobRole;
    private String careerGoals;
    private LocalDateTime updatedAt;
    private LocalDateTime createdAt;
}
