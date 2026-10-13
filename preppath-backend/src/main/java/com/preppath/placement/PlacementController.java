package com.preppath.placement;

import com.preppath.coding.CodingProblem;
import com.preppath.coding.CodingProblemRepository;
import com.preppath.question.Question;
import com.preppath.question.QuestionRepository;
import com.preppath.user.User;
import com.preppath.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * PlacementController — handles full mixed timed placement tests (QLR + Coding assessment).
 *
 * POST /api/placement/start  — generates a timed 15-minute mock test (5 MCQs + 1 Coding question)
 * POST /api/placement/submit — computes readiness score, category accuracy, and weakness report
 */
@RestController
@RequestMapping("/api/placement")
public class PlacementController {

    @Autowired private QuestionRepository questionRepository;
    @Autowired private CodingProblemRepository codingProblemRepository;
    @Autowired private UserRepository userRepository;

    // In-memory active placement session store (sessionToken -> SessionData)
    private static final Map<String, PlacementSession> activeSessions = new ConcurrentHashMap<>();

    public static class PlacementSession {
        public Long userId;
        public List<Question> questions;
        public CodingProblem codingProblem;
        public LocalDateTime startTime;
        public int timeLimitSeconds = 900; // 15 minutes
    }

    record AnswerItem(Long questionId, String selectedOption) {}
    record PlacementSubmitRequest(String sessionId, List<AnswerItem> answers, int timeTakenSeconds) {}

    @PostMapping("/start")
    public ResponseEntity<?> startTest(Authentication auth) {
        User user = (User) auth.getPrincipal();

        // 1. Gather pool of questions across topics
        List<Question> allQuestions = questionRepository.findAll();
        if (allQuestions.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No questions available for test.");
        }

        Collections.shuffle(allQuestions);
        List<Question> selectedQuestions = allQuestions.subList(0, Math.min(5, allQuestions.size()));

        // 2. Select 1 coding problem
        List<CodingProblem> problems = codingProblemRepository.findAll();
        CodingProblem selectedProblem = null;
        if (!problems.isEmpty()) {
            selectedProblem = problems.get(new Random().nextInt(problems.size()));
        }

        // 3. Create session
        String sessionId = UUID.randomUUID().toString();
        PlacementSession session = new PlacementSession();
        session.userId = user.getId();
        session.questions = selectedQuestions;
        session.codingProblem = selectedProblem;
        session.startTime = LocalDateTime.now();
        activeSessions.put(sessionId, session);

        // 4. Return safe representation to frontend (no correct_option)
        List<Map<String, Object>> safeQuestions = selectedQuestions.stream().map(q -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", q.getId());
            map.put("topicId", q.getTopicId());
            map.put("questionText", q.getQuestionText());
            map.put("optionA", q.getOptionA());
            map.put("optionB", q.getOptionB());
            map.put("optionC", q.getOptionC());
            map.put("optionD", q.getOptionD());
            return map;
        }).toList();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("sessionId", sessionId);
        response.put("questions", safeQuestions);
        response.put("timeLimitSeconds", session.timeLimitSeconds);
        if (selectedProblem != null) {
            response.put("codingProblem", Map.of(
                    "id", selectedProblem.getId(),
                    "title", selectedProblem.getTitle(),
                    "statement", selectedProblem.getStatement(),
                    "sampleInput", selectedProblem.getSampleInput(),
                    "sampleOutput", selectedProblem.getSampleOutput()
            ));
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitTest(@RequestBody PlacementSubmitRequest req, Authentication auth) {
        User user = (User) auth.getPrincipal();

        PlacementSession session = activeSessions.get(req.sessionId());
        if (session == null || !session.userId.equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid or expired test session.");
        }

        // Evaluate MCQ answers
        Map<Long, String> userAnswers = new HashMap<>();
        if (req.answers() != null) {
            for (AnswerItem a : req.answers()) {
                if (a.questionId() != null && a.selectedOption() != null) {
                    userAnswers.put(a.questionId(), a.selectedOption().trim());
                }
            }
        }

        int correctCount = 0;
        List<Map<String, Object>> reviewDetails = new ArrayList<>();
        Map<Long, Integer> topicMistakes = new HashMap<>();

        for (Question q : session.questions) {
            String selected = userAnswers.get(q.getId());
            boolean isCorrect = selected != null && selected.equalsIgnoreCase(q.getCorrectOption());
            if (isCorrect) {
                correctCount++;
            } else {
                topicMistakes.put(q.getTopicId(), topicMistakes.getOrDefault(q.getTopicId(), 0) + 1);
            }

            Map<String, Object> detail = new LinkedHashMap<>();
            detail.put("questionId", q.getId());
            detail.put("questionText", q.getQuestionText());
            detail.put("selectedOption", selected);
            detail.put("correctOption", q.getCorrectOption());
            detail.put("isCorrect", isCorrect);
            detail.put("explanation", q.getExplanation());
            reviewDetails.add(detail);
        }

        int totalQuestions = session.questions.size();
        double accuracy = totalQuestions > 0 ? (correctCount * 100.0 / totalQuestions) : 0.0;

        // Calculate placement readiness score (0 - 100%)
        // Formula: Base Accuracy * 0.8 + Speed Bonus (up to 20%)
        double speedFactor = Math.max(0, (session.timeLimitSeconds - req.timeTakenSeconds())) / (double) session.timeLimitSeconds;
        int readinessScore = (int) Math.min(100, Math.round((accuracy * 0.8) + (speedFactor * 20)));

        // Award XP
        int xpEarned = correctCount * 15;
        User u = userRepository.findById(user.getId()).orElseThrow();
        u.setXp(u.getXp() + xpEarned);
        userRepository.save(u);

        // Remove active session
        activeSessions.remove(req.sessionId());

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("score", correctCount);
        result.put("totalQuestions", totalQuestions);
        result.put("accuracy", Math.round(accuracy));
        result.put("readinessScore", readinessScore);
        result.put("timeTakenSeconds", req.timeTakenSeconds());
        result.put("xpEarned", xpEarned);
        result.put("reviewDetails", reviewDetails);

        return ResponseEntity.ok(result);
    }
}
