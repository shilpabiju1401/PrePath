package com.preppath.coding.learn;

import jakarta.persistence.*;

@Entity
@Table(name = "topic_code_examples")
public class TopicCodeExample {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "topic_id", nullable = false)
    private Long topicId;

    @Column(nullable = false, length = 20)
    private String language; // c, java, python

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String code;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String explanation;

    @Column(name = "expected_output", nullable = false, columnDefinition = "TEXT")
    private String expectedOutput;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 1;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getTopicId() { return topicId; }
    public void setTopicId(Long topicId) { this.topicId = topicId; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public String getExpectedOutput() { return expectedOutput; }
    public void setExpectedOutput(String expectedOutput) { this.expectedOutput = expectedOutput; }

    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
}
