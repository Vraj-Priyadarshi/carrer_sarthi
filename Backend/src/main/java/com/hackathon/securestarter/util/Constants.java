package com.hackathon.securestarter.util;

public class Constants {

    // Token Expiration (used in AuthService)
    public static final int VERIFICATION_TOKEN_EXPIRATION_HOURS = 24;
    public static final int PASSWORD_RESET_TOKEN_EXPIRATION_HOURS = 1;

    // Email Templates (used in EmailService)
    public static final String VERIFICATION_EMAIL_SUBJECT = "Verify Your Email - Career Saarthi";
    public static final String PASSWORD_RESET_EMAIL_SUBJECT = "Reset Your Password - Career Saarthi";

    // Validation Messages (used in Services)
    public static final String INVALID_TOKEN = "Invalid or expired token";
    public static final String TOKEN_EXPIRED = "Token has expired";
    public static final String TOKEN_ALREADY_USED = "Token has already been used";
    public static final String USER_NOT_FOUND = "User not found";
    public static final String EMAIL_ALREADY_EXISTS = "Email already exists";
    public static final String INVALID_CREDENTIALS = "Invalid email or password";
    public static final String ACCOUNT_NOT_VERIFIED = "Account is not verified. Please check your email.";
    public static final String PASSWORD_MISMATCH = "Current password is incorrect";
    public static final String PASSWORD_CANNOT_BE_SAME_AS_OLD = "New password cannot be the same as the old password";


    // Success Messages (used in Services)
    public static final String SIGNUP_SUCCESS = "Registration successful! Please check your email to verify your account.";
    public static final String LOGIN_SUCCESS = "Login successful";
    public static final String VERIFICATION_SUCCESS = "Email verified successfully! You can now login.";
    public static final String PASSWORD_RESET_EMAIL_SENT = "Password reset instructions have been sent to your email.";
    public static final String PASSWORD_RESET_SUCCESS = "Password has been reset successfully.";
    public static final String PASSWORD_CHANGE_SUCCESS = "Password changed successfully.";
    public static final String PROFILE_UPDATE_SUCCESS = "Profile updated successfully.";

    // Onboarding Messages
    public static final String ONBOARDING_SUCCESS = "Onboarding completed successfully! Your profile has been created.";
    public static final String ONBOARDING_INCOMPLETE = "Please complete onboarding first.";
    public static final String ONBOARDING_ALREADY_COMPLETED = "Onboarding has already been completed.";

    // Profile Messages
    public static final String ACADEMIC_PROFILE_NOT_FOUND = "Academic profile not found. Please complete onboarding first.";
    public static final String CAREER_PROFILE_NOT_FOUND = "Career profile not found. Please complete onboarding first.";
    public static final String SKILL_PROFILE_NOT_FOUND = "Skill profile not found. Please complete onboarding first.";
    public static final String ACADEMIC_PROFILE_UPDATED = "Academic profile updated successfully.";
    public static final String CAREER_PROFILE_UPDATED = "Career profile updated successfully.";
    public static final String SKILL_PROFILE_UPDATED = "Skill profile updated successfully.";

    // Course Messages
    public static final String COURSE_NOT_FOUND = "Course not found or not owned by user.";
    public static final String COURSE_CREATED = "Course added successfully.";
    public static final String COURSE_UPDATED = "Course updated successfully.";
    public static final String COURSE_DELETED = "Course deleted successfully.";

    // Project Messages
    public static final String PROJECT_NOT_FOUND = "Project not found or not owned by user.";
    public static final String PROJECT_CREATED = "Project added successfully.";
    public static final String PROJECT_UPDATED = "Project updated successfully.";
    public static final String PROJECT_DELETED = "Project deleted successfully.";

    // Certification Messages
    public static final String CERTIFICATION_NOT_FOUND = "Certification not found or not owned by user.";
    public static final String CERTIFICATION_CREATED = "Certification added successfully.";
    public static final String CERTIFICATION_DELETED = "Certification deleted successfully.";

    // Industry Sectors
    public static final String SECTOR_HEALTHCARE = "Healthcare";
    public static final String SECTOR_AGRICULTURE = "Agriculture";
    public static final String SECTOR_URBAN = "Urban";

    private Constants() {
        // Private constructor to prevent instantiation
    }
}