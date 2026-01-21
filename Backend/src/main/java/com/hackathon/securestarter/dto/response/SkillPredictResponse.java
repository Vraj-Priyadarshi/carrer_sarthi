package com.hackathon.securestarter.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO for Skill Predict API (localhost:8001/skillPredict)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillPredictResponse {

    @JsonProperty("skill_gap_score")
    private Double skillGapScore;

    @JsonProperty("time_to_ready_months")
    private Double timeToReadyMonths;

    @JsonProperty("recommended_skills")
    private List<RecommendedSkill> recommendedSkills;

    @JsonProperty("status")
    private String status;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RecommendedSkill {

        @JsonProperty("skill")
        private String skill;

        @JsonProperty("confidence")
        private Double confidence;
    }
}
