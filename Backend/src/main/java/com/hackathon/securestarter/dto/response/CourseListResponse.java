package com.hackathon.securestarter.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO for Course list with statistics.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseListResponse {

    private List<CourseResponse> courses;
    private Integer totalCourses;
    private Double averageGrade;
    private Integer highestGradeCourseCount; // Courses with grade >= 90
    private String performanceLevel; // "Excellent", "Good", "Average", "Needs Improvement"

    /**
     * Calculate performance level based on average grade
     */
    public static String calculatePerformanceLevel(Double avgGrade) {
        if (avgGrade == null || avgGrade == 0) return "No Data";
        if (avgGrade >= 90) return "Excellent";
        if (avgGrade >= 75) return "Good";
        if (avgGrade >= 60) return "Average";
        return "Needs Improvement";
    }
}
