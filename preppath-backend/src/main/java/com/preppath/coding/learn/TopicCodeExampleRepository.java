package com.preppath.coding.learn;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TopicCodeExampleRepository extends JpaRepository<TopicCodeExample, Long> {
    List<TopicCodeExample> findByTopicIdOrderBySortOrderAsc(Long topicId);
    List<TopicCodeExample> findByTopicIdAndLanguageOrderBySortOrderAsc(Long topicId, String language);
}
