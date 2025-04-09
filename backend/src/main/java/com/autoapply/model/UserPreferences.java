package com.autoapply.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "user_preferences")
public class UserPreferences {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "desired_job_titles")
    @ElementCollection
    @CollectionTable(name = "desired_job_titles")
    private Set<String> desiredJobTitles = new HashSet<>();

    @Column(name = "desired_locations")
    @ElementCollection
    @CollectionTable(name = "desired_locations")
    private Set<String> desiredLocations = new HashSet<>();

    @Column(name = "desired_industries")
    @ElementCollection
    @CollectionTable(name = "desired_industries")
    private Set<String> desiredIndustries = new HashSet<>();

    @Column(name = "desired_job_types")
    @ElementCollection
    @CollectionTable(name = "desired_job_types")
    private Set<String> desiredJobTypes = new HashSet<>();

    @Column(name = "experience_level")
    private String experienceLevel;

    @Column(name = "min_salary")
    private Integer minSalary;

    @Column(name = "max_salary")
    private Integer maxSalary;

    @Column(name = "remote_only")
    private boolean remoteOnly;

    @Column(name = "auto_apply")
    private boolean autoApply;

    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt;

    @Column(name = "updated_at")
    private java.time.LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = java.time.LocalDateTime.now();
        updatedAt = java.time.LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = java.time.LocalDateTime.now();
    }
} 