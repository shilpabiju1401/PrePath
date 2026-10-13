package com.preppath.coding.learn;

import jakarta.persistence.*;

@Entity
@Table(name = "topic_visualizations")
public class TopicVisualization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "topic_id", nullable = false, unique = true)
    private Long topicId;

    @Column(name = "viz_type", nullable = false, length = 50)
    private String vizType = "DEFAULT";

    @Column(name = "steps_json", nullable = false, columnDefinition = "TEXT")
    private String stepsJson;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getTopicId() { return topicId; }
    public void setTopicId(Long topicId) { this.topicId = topicId; }

    public String getVizType() { return vizType; }
    public void setVizType(String vizType) { this.vizType = vizType; }

    public String getStepsJson() { return stepsJson; }
    public void setStepsJson(String stepsJson) { this.stepsJson = stepsJson; }
}
