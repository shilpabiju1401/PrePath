package com.preppath.coding.learn;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * TopicCompletion — records the first time a user clicks "Next Topic"
 * on a coding topic learn page, awarding 10 XP (once per topic per user).
 */
@Entity
@Table(name = "topic_completions",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "topic_id"}))
public class TopicCompletion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "topic_id", nullable = false)
    private Long topicId;

    @Column(name = "completed_at", nullable = false)
    private LocalDateTime completedAt;

    // ── Getters & Setters ──────────────────────────────────────────────────────

    public Long getId()                        { return id; }
    public void setId(Long id)                 { this.id = id; }

    public Long getUserId()                    { return userId; }
    public void setUserId(Long userId)         { this.userId = userId; }

    public Long getTopicId()                   { return topicId; }
    public void setTopicId(Long topicId)       { this.topicId = topicId; }

    public LocalDateTime getCompletedAt()                    { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt)    { this.completedAt = completedAt; }
}
