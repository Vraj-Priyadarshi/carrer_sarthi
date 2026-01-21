package com.hackathon.securestarter.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

// ============================================================================
// 1. ACADEMIC PROFILE ENTITY
// ============================================================================

@Entity
@Table(name = "academic_profiles", indexes = {
        @Index(name = "idx_academic_user_id", columnList = "user_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AcademicProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "education_level", nullable = false)
    private Integer educationLevel; // 1=High School, 2=Undergraduate, 3=Postgraduate, 4=PhD

    @Column(name = "cgpa_percentage", nullable = false)
    private Float cgpaPercentage; // 0-100

    @Column(name = "field_of_study", nullable = false, length = 200)
    private String fieldOfStudy;

    @Column(name = "institution", length = 200)
    private String institution;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}