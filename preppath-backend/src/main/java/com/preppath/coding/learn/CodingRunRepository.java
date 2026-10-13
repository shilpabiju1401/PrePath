package com.preppath.coding.learn;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CodingRunRepository extends JpaRepository<CodingRun, Long> {
    List<CodingRun> findByUserIdAndTopicIdOrderByCreatedAtDesc(Long userId, Long topicId);
    boolean existsByUserIdAndTopicIdAndStatus(Long userId, Long topicId, String status);
}
