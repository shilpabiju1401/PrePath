package com.preppath.coding.learn;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TopicCompletionRepository extends JpaRepository<TopicCompletion, Long> {
    boolean existsByUserIdAndTopicId(Long userId, Long topicId);
    long countByUserId(Long userId);
    java.util.List<TopicCompletion> findByUserId(Long userId);
}
