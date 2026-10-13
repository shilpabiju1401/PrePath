package com.preppath.quiz;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * QuizAttempt entity — stores each quiz session a student starts.
 *
 * Workflow:
 *  1. POST /quizzes/start  → creates a QuizAttempt row with status="IN_PROGRESS"
 *  2. POST /quizzes/answer → stores each answer, checks correctness
 *  3. POST /quizzes/submit → finalizes score, updates StudentProgress
 */
@Entity
@Table(name = "quiz_attempts")
public class QuizAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "topic_id", nullable = false)
    private Long topicId;

    @Column(name = "level_type", nullable = false, length = 20)
    private String levelType; // "EASY", "MEDIUM", "HARD", "CHALLENGE"

    @Column(nullable = false)
    private Integer score = 0; // Number of correct answers

    @Column(name = "total_questions", nullable = false)
    private Integer totalQuestions = 0;

    @Column(nullable = false)
    private Double accuracy = 0.0; // Percentage (0-100)

    @Column(name = "time_taken", nullable = false)
    private Integer timeTaken = 0; // Seconds

    @Column(nullable = false)
    private Boolean passed = false; // True if accuracy >= 70%

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // ── Getters and Setters ──
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getTopicId() { return topicId; }
    public void setTopicId(Long topicId) { this.topicId = topicId; }

    public String getLevelType() { return levelType; }
    public void setLevelType(String levelType) { this.levelType = levelType; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public Integer getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(Integer totalQuestions) { this.totalQuestions = totalQuestions; }

    public Double getAccuracy() { return accuracy; }
    public void setAccuracy(Double accuracy) { this.accuracy = accuracy; }

    public Integer getTimeTaken() { return timeTaken; }
    public void setTimeTaken(Integer timeTaken) { this.timeTaken = timeTaken; }

    public Boolean getPassed() { return passed; }
    public void setPassed(Boolean passed) { this.passed = passed; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
