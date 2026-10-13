package com.preppath.badge;

import jakarta.persistence.*;

/**
 * Badge entity — maps to the 'badges' table.
 * Each badge has a criteriaKey that the backend checks against.
 */
@Entity
@Table(name = "badges")
public class Badge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "criteria_key", nullable = false, unique = true, length = 50)
    private String criteriaKey;

    @Column(name = "icon_name", nullable = false, length = 50)
    private String iconName;

    // ── Getters and Setters ──
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCriteriaKey() { return criteriaKey; }
    public void setCriteriaKey(String criteriaKey) { this.criteriaKey = criteriaKey; }

    public String getIconName() { return iconName; }
    public void setIconName(String iconName) { this.iconName = iconName; }
}
