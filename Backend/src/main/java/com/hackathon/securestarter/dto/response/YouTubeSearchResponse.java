package com.hackathon.securestarter.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO for YouTube Search API
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class YouTubeSearchResponse {

    @JsonProperty("kind")
    private String kind;

    @JsonProperty("etag")
    private String etag;

    @JsonProperty("nextPageToken")
    private String nextPageToken;

    @JsonProperty("regionCode")
    private String regionCode;

    @JsonProperty("pageInfo")
    private PageInfo pageInfo;

    @JsonProperty("items")
    private List<SearchItem> items;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PageInfo {

        @JsonProperty("totalResults")
        private Integer totalResults;

        @JsonProperty("resultsPerPage")
        private Integer resultsPerPage;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SearchItem {

        @JsonProperty("kind")
        private String kind;

        @JsonProperty("etag")
        private String etag;

        @JsonProperty("id")
        private VideoId id;

        @JsonProperty("snippet")
        private Snippet snippet;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class VideoId {

        @JsonProperty("kind")
        private String kind;

        @JsonProperty("videoId")
        private String videoId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Snippet {

        @JsonProperty("publishedAt")
        private String publishedAt;

        @JsonProperty("channelId")
        private String channelId;

        @JsonProperty("title")
        private String title;

        @JsonProperty("description")
        private String description;

        @JsonProperty("channelTitle")
        private String channelTitle;
    }
}
