package com.hackathon.securestarter.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Academic Profile creation/update requests.
 * Contains validation rules for academic data.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AcademicProfileRequest {

    @NotNull(message = "Education level is required")
    @Min(value = 1, message = "Education level must be at least 1")
    @Max(value = 4, message = "Education level must be at most 4")
    private Integer educationLevel; // 1=High School, 2=Undergraduate, 3=Postgraduate, 4=PhD

    @NotNull(message = "CGPA/Percentage is required")
    @DecimalMin(value = "0.0", message = "CGPA/Percentage must be at least 0")
    @DecimalMax(value = "100.0", message = "CGPA/Percentage must be at most 100")
    private Float cgpaPercentage;

    @NotBlank(message = "Field of study is required")
    @Size(max = 200, message = "Field of study cannot exceed 200 characters")
    private String fieldOfStudy;

    @Size(max = 200, message = "Institution cannot exceed 200 characters")
    private String institution;
}
