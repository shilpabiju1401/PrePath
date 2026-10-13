package com.preppath.coding.learn;

import jakarta.persistence.*;

@Entity
@Table(name = "topic_sections")
public class TopicSection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "topic_id", nullable = false)
    private Long topicId;

    @Column(name = "section_type", nullable = false, length = 50)
    private String sectionType; // ANALOGY, CONCEPT, MISTAKES, SUMMARY

    @Column(nullable = false, length = 200)
    private String title;

    @Column(name = "content_markdown", nullable = false, columnDefinition = "TEXT")
    private String contentMarkdown;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 1;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getTopicId() { return topicId; }
    public void setTopicId(Long topicId) { this.topicId = topicId; }

    public String getSectionType() { return sectionType; }
    public void setSectionType(String sectionType) { this.sectionType = sectionType; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContentMarkdown() { return contentMarkdown; }
    public void setContentMarkdown(String contentMarkdown) { this.contentMarkdown = contentMarkdown; }

    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
}
