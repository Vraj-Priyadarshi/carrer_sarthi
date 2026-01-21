package com.hackathon.securestarter.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Response DTO for a single Certification.
 * Only returns certification name as per frontend requirements.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CertificationResponse {

    private UUID id;
    private String certificationName;
    private LocalDateTime createdAt;
}
