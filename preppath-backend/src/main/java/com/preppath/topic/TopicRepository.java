package com.preppath.topic;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {

    // Find all topics in a category, sorted by sequence_order
    List<Topic> findByCategoryIdOrderBySequenceOrderAsc(Long categoryId);

    // Find a topic by its position in a category (for unlocking the next one)
    Optional<Topic> findByCategoryIdAndSequenceOrder(Long categoryId, Integer sequenceOrder);
}
