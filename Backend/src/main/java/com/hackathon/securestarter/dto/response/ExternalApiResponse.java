package com.hackathon.securestarter.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Combined response for external API data used in Dashboard.
 * Contains recommendations from ML service and skill predictions.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExternalApiResponse {

    /**
     * ML Recommendation data (courses and projects)
     */
    private MLRecommendationResponse recommendations;

    /**
     * Skill prediction data (skill gaps and time to ready)
     */
    private SkillPredictResponse skillPrediction;

    /**
     * Status of external API calls
     */
    private ApiCallStatus status;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ApiCallStatus {
        private Boolean recommendationsSuccess;
        private Boolean skillPredictSuccess;
        private Boolean youtubeEnrichmentSuccess;
        private String errorMessage;
    }
}
