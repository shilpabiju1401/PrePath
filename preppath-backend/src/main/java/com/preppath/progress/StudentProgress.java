package com.preppath.progress;

import jakarta.persistence.*;

/**
 * StudentProgress entity — tracks a user's best score for each level in each topic.
 *
 * This is the central table used to enforce the unlock rules:
 * - Easy must pass (≥70%) before Medium unlocks
 * - Medium must pass before Hard unlocks
 * - Hard must pass before Challenge unlocks
 * - Challenge pass unlocks the next topic
 *
 * IMPORTANT: The backend ALWAYS checks this table before allowing a quiz to start.
 * Even if the frontend is manipulated, the backend rejects locked requests.
 */
@Entity
@Table(name = "student_progress",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "topic_id"}))
public class StudentProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "topic_id", nullable = false)
    private Long topicId;

    @Column(name = "easy_best")
    private Double easyBest = 0.0;   // Best accuracy % on Easy (0-100)

    @Column(name = "medium_best")
    private Double mediumBest = 0.0;

    @Column(name = "hard_best")
    private Double hardBest = 0.0;

    @Column(name = "challenge_best")
    private Double challengeBest = 0.0;

    @Column(nullable = false, length = 30)
    private String status = "LOCKED"; // LOCKED | UNLOCKED | IN_PROGRESS | COMPLETED

    @Column(nullable = false)
    private Boolean practiced = false;

    // ── Convenience methods for unlock logic ──

    /** Check if Easy level is passed (≥70% accuracy) */
    public boolean isEasyPassed() { return easyBest != null && easyBest >= 70.0; }

    /** Check if Medium level is passed */
    public boolean isMediumPassed() { return mediumBest != null && mediumBest >= 70.0; }

    /** Check if Hard level is passed */
    public boolean isHardPassed() { return hardBest != null && hardBest >= 70.0; }

    /** Check if Challenge is passed */
    public boolean isChallengePassed() { return challengeBest != null && challengeBest >= 70.0; }

    // ── Getters and Setters ──
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getTopicId() { return topicId; }
    public void setTopicId(Long topicId) { this.topicId = topicId; }

    public Double getEasyBest() { return easyBest; }
    public void setEasyBest(Double easyBest) { this.easyBest = easyBest; }

    public Double getMediumBest() { return mediumBest; }
    public void setMediumBest(Double mediumBest) { this.mediumBest = mediumBest; }

    public Double getHardBest() { return hardBest; }
    public void setHardBest(Double hardBest) { this.hardBest = hardBest; }

    public Double getChallengeBest() { return challengeBest; }
    public void setChallengeBest(Double challengeBest) { this.challengeBest = challengeBest; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Boolean getPracticed() { return practiced; }
    public void setPracticed(Boolean practiced) { this.practiced = practiced; }
}
