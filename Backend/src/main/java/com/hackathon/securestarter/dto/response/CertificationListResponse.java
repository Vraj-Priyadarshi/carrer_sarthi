package com.hackathon.securestarter.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO for Certification list with statistics.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CertificationListResponse {

    private List<CertificationResponse> certifications;
    private Integer totalCertifications;
    private Integer activeCertifications; // Not expired
    private Integer expiredCertifications;
}
