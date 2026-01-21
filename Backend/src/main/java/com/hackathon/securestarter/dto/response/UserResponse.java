package com.hackathon.securestarter.dto.response;

import com.hackathon.securestarter.enums.AuthProvider;
import com.hackathon.securestarter.enums.Gender;
import com.hackathon.securestarter.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private UUID id;
    private String email;
    private String firstName;
    private String lastName;
    private LocalDate dob;
    private String phone;
    private Gender gender;
    private Role role;
    private AuthProvider authProvider;
    private Boolean isVerified;
    private LocalDateTime createdAt;
}