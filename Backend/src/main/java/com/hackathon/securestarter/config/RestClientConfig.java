package com.hackathon.securestarter.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

import java.time.Duration;

/**
 * Configuration for RestClient beans used for external API calls.
 */
@Configuration
public class RestClientConfig {

    @Value("${external.api.ml-recommendations.base-url:http://localhost:8000}")
    private String mlRecommendationsBaseUrl;

    @Value("${external.api.skill-predict.base-url:http://localhost:8001}")
    private String skillPredictBaseUrl;

    @Value("${external.api.youtube.base-url:https://www.googleapis.com/youtube/v3}")
    private String youtubeBaseUrl;

    @Value("${external.api.timeout-seconds:3}")
    private int timeoutSeconds;

    /**
     * RestClient for ML Recommendations API
     */
    @Bean(name = "mlRecommendationsRestClient")
    public RestClient mlRecommendationsRestClient() {
        return RestClient.builder()
                .baseUrl(mlRecommendationsBaseUrl)
                .requestFactory(createRequestFactory())
                .build();
    }

    /**
     * RestClient for Skill Predict API
     */
    @Bean(name = "skillPredictRestClient")
    public RestClient skillPredictRestClient() {
        return RestClient.builder()
                .baseUrl(skillPredictBaseUrl)
                .requestFactory(createRequestFactory())
                .build();
    }

    /**
     * RestClient for YouTube API
     */
    @Bean(name = "youtubeRestClient")
    public RestClient youtubeRestClient() {
        return RestClient.builder()
                .baseUrl(youtubeBaseUrl)
                .requestFactory(createRequestFactory())
                .build();
    }

    /**
     * Create request factory with timeout settings
     */
    private SimpleClientHttpRequestFactory createRequestFactory() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(timeoutSeconds));
        factory.setReadTimeout(Duration.ofSeconds(timeoutSeconds));
        return factory;
    }
}
