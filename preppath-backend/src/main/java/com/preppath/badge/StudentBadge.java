package com.preppath.badge;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * StudentBadge — junction table: which badges has which student earned?
 */
@Entity
@Table(name = "student_badges",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "badge_id"}))
public class StudentBadge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "badge_id", nullable = false)
    private Long badgeId;

    @Column(name = "earned_at", nullable = false)
    private LocalDateTime earnedAt = LocalDateTime.now();

    // ── Getters and Setters ──
    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getBadgeId() { return badgeId; }
    public void setBadgeId(Long badgeId) { this.badgeId = badgeId; }
    public LocalDateTime getEarnedAt() { return earnedAt; }
}
