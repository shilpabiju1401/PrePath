package com.preppath.topic;

import jakarta.persistence.*;

/**
 * Topic entity — maps to the 'topics' table.
 * A topic belongs to a category and has learning content + a sequence number.
 */
@Entity
@Table(name = "topics")
public class Topic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // Many topics belong to one category
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "learning_content", columnDefinition = "TEXT")
    private String learningContent; // The concept explanation shown before quizzes

    @Column(name = "sequence_order", nullable = false)
    private Integer sequenceOrder = 1; // Order within the category (1, 2, 3…)

    // ── Getters and Setters ──
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLearningContent() { return learningContent; }
    public void setLearningContent(String learningContent) { this.learningContent = learningContent; }

    public Integer getSequenceOrder() { return sequenceOrder; }
    public void setSequenceOrder(Integer sequenceOrder) { this.sequenceOrder = sequenceOrder; }
}
