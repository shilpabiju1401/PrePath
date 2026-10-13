package com.preppath.admin;

import com.preppath.coding.CodingProblemRepository;
import com.preppath.question.QuestionRepository;
import com.preppath.topic.TopicRepository;
import com.preppath.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * AdminController — allows viewing system overview and stats.
 *
 * GET /api/admin/stats
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired private UserRepository userRepository;
    @Autowired private TopicRepository topicRepository;
    @Autowired private QuestionRepository questionRepository;
    @Autowired private CodingProblemRepository codingProblemRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getSystemStats() {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalTopics", topicRepository.count());
        stats.put("totalQuestions", questionRepository.count());
        stats.put("totalCodingProblems", codingProblemRepository.count());
        return ResponseEntity.ok(stats);
    }
}
