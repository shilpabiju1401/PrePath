package com.preppath.coding;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * CodingSubmission entity — stores students' code runs and submissions.
 */
@Entity
@Table(name = "coding_submissions")
public class CodingSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "problem_id", nullable = false)
    private Long problemId;

    @Column(nullable = false, length = 20)
    private String language;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String code;

    @Column(nullable = false, length = 50)
    private String status; // ACCEPTED, WRONG_ANSWER, COMPILATION_ERROR, etc.

    private Double runtime;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getProblemId() { return problemId; }
    public void setProblemId(Long problemId) { this.problemId = problemId; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getRuntime() { return runtime; }
    public void setRuntime(Double runtime) { this.runtime = runtime; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
