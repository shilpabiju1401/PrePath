package com.preppath.progress;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentProgressRepository extends JpaRepository<StudentProgress, Long> {

    // Get all progress records for a user
    List<StudentProgress> findByUserId(Long userId);

    // Get progress for a specific user + topic combination
    Optional<StudentProgress> findByUserIdAndTopicId(Long userId, Long topicId);

    // Check how many topics are completed (for progress %)
    long countByUserIdAndStatus(Long userId, String status);
}
