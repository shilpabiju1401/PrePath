package com.preppath.topic;

import com.preppath.progress.StudentProgress;
import com.preppath.progress.StudentProgressRepository;
import com.preppath.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

/**
 * TopicController — serves topic lists and individual topic details.
 *
 * GET /api/topics?categoryId={id}  — list topics for a category with lock status
 * GET /api/topics/{topicId}        — topic detail + level lock status for quiz page
 */
@RestController
@RequestMapping("/api/topics")
public class TopicController {

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private StudentProgressRepository progressRepository;

    /**
     * Returns all topics for a category, enriched with the current user's
     * lock/unlock/completed status.
     *
     * The FIRST topic in each category is always unlocked by default.
     * Other topics require passing the previous topic's Challenge.
     */
    @GetMapping
    public ResponseEntity<?> getTopicsByCategory(
            @RequestParam Long categoryId, Authentication auth) {
        User user = (User) auth.getPrincipal();

        // Get all topics sorted by sequence order
        List<Topic> topics = topicRepository.findByCategoryIdOrderBySequenceOrderAsc(categoryId);

        // Get this user's progress for all these topics at once
        Map<Long, StudentProgress> progressMap = new HashMap<>();
        progressRepository.findByUserId(user.getId())
                .forEach(p -> progressMap.put(p.getTopicId(), p));

        // Build response with status for each topic
        List<Map<String, Object>> result = topics.stream().map(topic -> {
            StudentProgress progress = progressMap.get(topic.getId());

            // Determine status: first topic is auto-unlocked, others need progress
            String status;
            if (topic.getSequenceOrder() == 1 && progress == null) {
                status = "UNLOCKED"; // First topic is always accessible
            } else if (progress == null) {
                status = "LOCKED";
            } else {
                status = progress.getStatus();
            }

            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", topic.getId());
            map.put("name", topic.getName());
            map.put("description", topic.getDescription());
            map.put("sequenceOrder", topic.getSequenceOrder());
            map.put("status", status);
            return map;
        }).toList();

        return ResponseEntity.ok(result);
    }

    /**
     * Returns full topic detail including learning content and the 4 level cards
     * with their lock status for the current user.
     */
    @GetMapping("/{topicId}")
    public ResponseEntity<?> getTopicDetail(@PathVariable Long topicId, Authentication auth) {
        User user = (User) auth.getPrincipal();

        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Topic not found"));

        // Get this user's progress for this topic
        StudentProgress progress = progressRepository
                .findByUserIdAndTopicId(user.getId(), topicId)
                .orElse(null);

        // Determine if the topic is accessible at all
        boolean topicAccessible = topic.getSequenceOrder() == 1 // First topic is always open
                || (progress != null && !"LOCKED".equals(progress.getStatus()));

        if (!topicAccessible) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This topic is locked.");
        }

        // Build level info with lock status
        // Rules: Easy always open if topic unlocked, Medium needs Easy pass, etc.
        List<Map<String, Object>> levels = new ArrayList<>();
        for (String levelType : new String[]{"EASY", "MEDIUM", "HARD", "CHALLENGE"}) {
            Map<String, Object> levelMap = new LinkedHashMap<>();
            levelMap.put("type", levelType);
            levelMap.put("locked", isLevelLocked(levelType, progress));
            levelMap.put("passed", isLevelPassed(levelType, progress));
            levelMap.put("bestScore", getLevelBestScore(levelType, progress));
            levels.add(levelMap);
        }

        // Build topic DTO (includes learning content)
        Map<String, Object> topicDto = new LinkedHashMap<>();
        topicDto.put("id", topic.getId());
        topicDto.put("name", topic.getName());
        topicDto.put("description", topic.getDescription());
        topicDto.put("learningContent", topic.getLearningContent());
        topicDto.put("sequenceOrder", topic.getSequenceOrder());

        return ResponseEntity.ok(Map.of("topic", topicDto, "levels", levels));
    }

    // ── Private helpers ──

    private boolean isLevelLocked(String levelType, StudentProgress progress) {
        if (progress == null) {
            // No progress record: only Easy is unlocked (first topic default)
            return !"EASY".equals(levelType);
        }
        return switch (levelType) {
            case "EASY"      -> false; // Always unlocked when topic is accessible
            case "MEDIUM"    -> !progress.isEasyPassed();
            case "HARD"      -> !progress.isMediumPassed();
            case "CHALLENGE" -> !progress.isHardPassed();
            default          -> true;
        };
    }

    private boolean isLevelPassed(String levelType, StudentProgress progress) {
        if (progress == null) return false;
        return switch (levelType) {
            case "EASY"      -> progress.isEasyPassed();
            case "MEDIUM"    -> progress.isMediumPassed();
            case "HARD"      -> progress.isHardPassed();
            case "CHALLENGE" -> progress.isChallengePassed();
            default          -> false;
        };
    }

    private Double getLevelBestScore(String levelType, StudentProgress progress) {
        if (progress == null) return null;
        return switch (levelType) {
            case "EASY"      -> progress.getEasyBest();
            case "MEDIUM"    -> progress.getMediumBest();
            case "HARD"      -> progress.getHardBest();
            case "CHALLENGE" -> progress.getChallengeBest();
            default          -> null;
        };
    }
}
