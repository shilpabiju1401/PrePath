package com.preppath.user;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * User entity — maps to the 'users' table in PostgreSQL.
 *
 * JPA @Entity means: "This Java class represents a database table."
 * Each field with @Column maps to a table column.
 */
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment ID
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash; // Stores BCrypt hash, never plain text!

    @Column(nullable = false, length = 20)
    private String role = "STUDENT"; // STUDENT or ADMIN

    @Column(nullable = false)
    private Integer xp = 0;

    @Column(name = "streak_count", nullable = false)
    private Integer streakCount = 0;

    @Column(name = "last_active_date")
    private LocalDate lastActiveDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // ── Getters and Setters ──
    // We write these manually (no Lombok) so beginners can see exactly what's happening.

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Integer getXp() { return xp; }
    public void setXp(Integer xp) { this.xp = xp; }

    public Integer getStreakCount() { return streakCount; }
    public void setStreakCount(Integer streakCount) { this.streakCount = streakCount; }

    public LocalDate getLastActiveDate() { return lastActiveDate; }
    public void setLastActiveDate(LocalDate lastActiveDate) { this.lastActiveDate = lastActiveDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
