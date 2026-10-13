package com.preppath.coding.learn;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "coding_runs")
public class CodingRun {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "topic_id", nullable = false)
    private Long topicId;

    @Column(nullable = false, length = 20)
    private String language;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String code;

    @Column(columnDefinition = "TEXT")
    private String stdin;

    @Column(nullable = false, length = 50)
    private String status;

    @Column(columnDefinition = "TEXT")
    private String stdout;

    @Column(columnDefinition = "TEXT")
    private String stderr;

    private Double runtime;

    @Column(name = "xp_awarded", nullable = false)
    private Integer xpAwarded = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getTopicId() { return topicId; }
    public void setTopicId(Long topicId) { this.topicId = topicId; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getStdin() { return stdin; }
    public void setStdin(String stdin) { this.stdin = stdin; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getStdout() { return stdout; }
    public void setStdout(String stdout) { this.stdout = stdout; }

    public String getStderr() { return stderr; }
    public void setStderr(String stderr) { this.stderr = stderr; }

    public Double getRuntime() { return runtime; }
    public void setRuntime(Double runtime) { this.runtime = runtime; }

    public Integer getXpAwarded() { return xpAwarded; }
    public void setXpAwarded(Integer xpAwarded) { this.xpAwarded = xpAwarded; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
