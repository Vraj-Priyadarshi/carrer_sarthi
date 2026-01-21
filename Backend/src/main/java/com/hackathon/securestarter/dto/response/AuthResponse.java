package com.hackathon.securestarter.dto.response;

import com.hackathon.securestarter.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String accessToken;
    private String tokenType = "Bearer";
    private UUID userId;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
    private Boolean isVerified;

    public AuthResponse(String accessToken, UUID userId, String email, String firstName,
                        String lastName, Role role, Boolean isVerified) {
        this.accessToken = accessToken;
        this.userId = userId;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.isVerified = isVerified;
    }
}