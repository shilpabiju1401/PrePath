package com.preppath.coding.learn;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TopicVisualizationRepository extends JpaRepository<TopicVisualization, Long> {
    Optional<TopicVisualization> findByTopicId(Long topicId);
}
