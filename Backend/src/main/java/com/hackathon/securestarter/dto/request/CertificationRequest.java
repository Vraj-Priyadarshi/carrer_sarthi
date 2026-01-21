package com.hackathon.securestarter.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Certification creation requests.
 * Only collects certification name as per frontend requirements.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CertificationRequest {

    @NotBlank(message = "Certification name is required")
    @Size(max = 300, message = "Certification name cannot exceed 300 characters")
    private String certificationName;
}
