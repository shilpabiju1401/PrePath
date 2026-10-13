package com.preppath.quiz;

import com.preppath.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * QuizController — REST endpoints for the quiz flow.
 *
 * POST /api/quizzes/start   — starts a quiz (validates unlock rules)
 * POST /api/quizzes/answer  — checks one answer, returns feedback
 * POST /api/quizzes/submit  — finalizes the quiz, updates progress
 */
@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    @Autowired
    private QuizService quizService;

    // ── Request records (simple Java 16+ record types as DTOs) ──
    record StartRequest(Long topicId, String levelType) {}
    record AnswerRequest(Long attemptId, Long questionId, String selectedOption) {}
    record SubmitRequest(Long attemptId, Integer timeTaken) {}

    /**
     * Start a new quiz. Returns attempt ID + questions (no correct answers!).
     * Will return 403 if the level is locked for this user.
     */
    @PostMapping("/start")
    public ResponseEntity<?> startQuiz(@RequestBody StartRequest req, Authentication auth) {
        User user = (User) auth.getPrincipal();
        Map<String, Object> result = quizService.startQuiz(user.getId(), req.topicId(), req.levelType());
        return ResponseEntity.ok(result);
    }

    /**
     * Submit one answer. Returns whether it was correct + explanation.
     * correctOption is ONLY returned here, after the answer is locked in.
     */
    @PostMapping("/answer")
    public ResponseEntity<?> checkAnswer(@RequestBody AnswerRequest req, Authentication auth) {
        User user = (User) auth.getPrincipal();
        Map<String, Object> result = quizService.checkAnswer(
                user.getId(), req.attemptId(), req.questionId(), req.selectedOption());
        return ResponseEntity.ok(result);
    }

    /**
     * Submit the entire quiz. Calculates score, updates progress, awards XP.
     */
    @PostMapping("/submit")
    public ResponseEntity<?> submitQuiz(@RequestBody SubmitRequest req, Authentication auth) {
        User user = (User) auth.getPrincipal();
        Map<String, Object> result = quizService.submitQuiz(
                user.getId(), req.attemptId(), req.timeTaken() != null ? req.timeTaken() : 0);
        return ResponseEntity.ok(result);
    }
}
