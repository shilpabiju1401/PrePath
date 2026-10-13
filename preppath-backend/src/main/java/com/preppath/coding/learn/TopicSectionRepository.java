package com.preppath.coding.learn;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TopicSectionRepository extends JpaRepository<TopicSection, Long> {
    List<TopicSection> findByTopicIdOrderBySortOrderAsc(Long topicId);
}
