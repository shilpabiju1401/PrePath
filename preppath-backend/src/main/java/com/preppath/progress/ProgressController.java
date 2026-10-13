package com.preppath.progress;

import com.preppath.coding.learn.CodingTopicRepository;
import com.preppath.coding.learn.TopicCompletionRepository;
import com.preppath.topic.TopicRepository;
import com.preppath.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * ProgressController — serves the user's overall learning progress summary.
 * Used by the Dashboard to show progress bars for each category.
 *
 * GET /api/progress/me
 */
@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    @Autowired
    private StudentProgressRepository progressRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private TopicCompletionRepository topicCompletionRepository;

    @Autowired
    private CodingTopicRepository codingTopicRepository;

    /**
     * Returns percentage completion for each category and overall.
     * Formula: (completed topics / total topics) * 100
     */
    @GetMapping("/me")
    public ResponseEntity<?> getMyProgress(Authentication auth) {
        User user = (User) auth.getPrincipal();
        Long userId = user.getId();

        // Get all progress records for this user
        List<StudentProgress> allProgress = progressRepository.findByUserId(userId);

        // Group by status for each category
        // Category IDs from seed: 1=Aptitude, 2=Reasoning, 3=Verbal
        double aptitude  = calcProgress(userId, 1L, allProgress);
        double reasoning = calcProgress(userId, 2L, allProgress);
        double verbal    = calcProgress(userId, 3L, allProgress);

        // Coding DSA progress: calculate percentage of coding topics completed via Next button or practiced
        long totalCodingTopics = codingTopicRepository.count();
        long completedCodingTopics = topicCompletionRepository.countByUserId(userId);
        
        // Count practiced DSA topics from student_progress if any
        long practicedCodingTopics = allProgress.stream()
                .filter(sp -> Boolean.TRUE.equals(sp.getPracticed()))
                .map(StudentProgress::getTopicId)
                .distinct()
                .count();

        long effectiveCompletedCoding = Math.max(completedCodingTopics, practicedCodingTopics);
        double coding = totalCodingTopics > 0 
                ? Math.min(100.0, (effectiveCompletedCoding * 100.0) / totalCodingTopics)
                : 0.0;

        // Overall QLR = average of three QLR categories
        double qlr = (aptitude + reasoning + verbal) / 3.0;

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("qlrProgress",       Math.round(qlr));
        result.put("codingProgress",    Math.round(coding));
        result.put("aptitudeProgress",  Math.round(aptitude));
        result.put("reasoningProgress", Math.round(reasoning));
        result.put("verbalProgress",    Math.round(verbal));
        result.put("completedCodingTopics", effectiveCompletedCoding);
        result.put("totalCodingTopics", totalCodingTopics);
        return ResponseEntity.ok(result);
    }

    /**
     * Calculate completion % for one category.
     * Considers progress across all 4 levels (Easy, Medium, Hard, Challenge) for topics in this category.
     */
    private double calcProgress(Long userId, Long categoryId, List<StudentProgress> allProgress) {
        List<Long> topicIds = topicRepository
                .findByCategoryIdOrderBySequenceOrderAsc(categoryId)
                .stream().map(t -> t.getId()).toList();

        if (topicIds.isEmpty()) return 0.0;

        // Total possible level milestones = 4 levels * number of topics
        int totalMilestones = topicIds.size() * 4;
        int completedMilestones = 0;

        Map<Long, StudentProgress> progressMap = new HashMap<>();
        for (StudentProgress sp : allProgress) {
            progressMap.put(sp.getTopicId(), sp);
        }

        for (Long tId : topicIds) {
            StudentProgress sp = progressMap.get(tId);
            if (sp != null) {
                if (sp.isEasyPassed()) completedMilestones++;
                if (sp.isMediumPassed()) completedMilestones++;
                if (sp.isHardPassed()) completedMilestones++;
                if (sp.isChallengePassed() || "COMPLETED".equals(sp.getStatus())) completedMilestones++;
            }
        }

        return (completedMilestones * 100.0) / totalMilestones;
    }
}
