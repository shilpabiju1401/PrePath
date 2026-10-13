package com.preppath.question;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    // Get all questions for a topic at a specific difficulty level
    List<Question> findByTopicIdAndDifficulty(Long topicId, String difficulty);

    // Count questions for a topic (used in seeding verification)
    long countByTopicId(Long topicId);
}
