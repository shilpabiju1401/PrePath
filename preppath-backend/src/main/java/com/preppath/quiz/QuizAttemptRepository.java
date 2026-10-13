package com.preppath.quiz;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByUserIdAndTopicIdAndLevelType(Long userId, Long topicId, String levelType);
    boolean existsByIdAndUserId(Long id, Long userId);
}
