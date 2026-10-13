package com.preppath.coding.learn;

import jakarta.persistence.*;

@Entity
@Table(name = "coding_topics")
public class CodingTopic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "level_number", nullable = false)
    private Integer levelNumber;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "sequence_order", nullable = false)
    private Integer sequenceOrder = 1;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String summary;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getLevelNumber() { return levelNumber; }
    public void setLevelNumber(Integer levelNumber) { this.levelNumber = levelNumber; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getSequenceOrder() { return sequenceOrder; }
    public void setSequenceOrder(Integer sequenceOrder) { this.sequenceOrder = sequenceOrder; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
}
