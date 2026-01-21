package com.hackathon.securestarter.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "career_profiles", indexes = {
        @Index(name = "idx_career_user_id", columnList = "user_id"),
        @Index(name = "idx_career_sector", columnList = "industry_sector")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CareerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "industry_sector", nullable = false, length = 50)
    private String industrySector; // "Healthcare", "Agriculture", "Urban"

    @Column(name = "target_job_role", nullable = false, length = 200)
    private String targetJobRole;

    @Column(name = "career_goals", length = 1000)
    private String careerGoals;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
