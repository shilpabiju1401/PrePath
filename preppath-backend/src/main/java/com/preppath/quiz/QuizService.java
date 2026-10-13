package com.preppath.quiz;

import com.preppath.progress.StudentProgress;
import com.preppath.progress.StudentProgressRepository;
import com.preppath.question.Question;
import com.preppath.question.QuestionRepository;
import com.preppath.topic.Topic;
import com.preppath.topic.TopicRepository;
import com.preppath.user.User;
import com.preppath.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

/**
 * QuizService — contains ALL the quiz business logic.
 *
 * This is the most important service in the app. It enforces:
 *  - Backend-side level unlocking (70% rule)
 *  - Score calculation
 *  - XP awarding (only on first pass, not repeated replays)
 *  - StudentProgress updating
 *  - Next topic unlocking after Challenge completion
 *
 * The frontend CANNOT bypass these rules — it only shows what we tell it.
 */
@Service
public class QuizService {

    private static final double PASS_THRESHOLD = 70.0; // 70% required to pass
    private static final int XP_PER_CORRECT_ANSWER = 10;
    private static final int XP_PASS_BONUS = 50;

    @Autowired private QuestionRepository questionRepository;
    @Autowired private QuizAttemptRepository quizAttemptRepository;
    @Autowired private QuizAttemptAnswerRepository answerRepository;
    @Autowired private StudentProgressRepository progressRepository;
    @Autowired private TopicRepository topicRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private com.preppath.badge.GamificationService gamificationService;

    // ─────────────────────────────────────────
    // STEP 1: Start a quiz — enforce lock check
    // ─────────────────────────────────────────

    /**
     * Creates a new QuizAttempt and returns questions WITHOUT correct answers.
     * THROWS 403 if the level is still locked for this user.
     */
    @Transactional
    public Map<String, Object> startQuiz(Long userId, Long topicId, String levelType) {
        // 1. Verify the topic exists
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Topic not found"));

        // 2. Check if this level is unlocked for the user (BACKEND ENFORCEMENT)
        assertLevelUnlocked(userId, topicId, levelType);

        // 3. Fetch questions for this level
        // CHALLENGE uses all three difficulties (Easy+Medium+Hard)
        List<Question> questions;
        if ("CHALLENGE".equals(levelType)) {
            questions = new ArrayList<>();
            questions.addAll(questionRepository.findByTopicIdAndDifficulty(topicId, "EASY"));
            questions.addAll(questionRepository.findByTopicIdAndDifficulty(topicId, "MEDIUM"));
            questions.addAll(questionRepository.findByTopicIdAndDifficulty(topicId, "HARD"));
            Collections.shuffle(questions);
            questions = questions.subList(0, Math.min(5, questions.size()));
        } else {
            questions = new ArrayList<>(questionRepository.findByTopicIdAndDifficulty(topicId, levelType));
            Collections.shuffle(questions);
            questions = questions.subList(0, Math.min(5, questions.size()));
        }

        if (questions.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "No questions found for this topic and level.");
        }

        // 4. Create a new quiz attempt record in the database
        QuizAttempt attempt = new QuizAttempt();
        attempt.setUserId(userId);
        attempt.setTopicId(topicId);
        attempt.setLevelType(levelType);
        attempt.setTotalQuestions(questions.size());
        quizAttemptRepository.save(attempt);

        // 5. Return attempt ID + questions WITHOUT correctOption (security!)
        List<Map<String, Object>> safeQuestions = questions.stream()
                .map(q -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("id", q.getId());
                    map.put("questionText", q.getQuestionText());
                    map.put("optionA", q.getOptionA());
                    map.put("optionB", q.getOptionB());
                    map.put("optionC", q.getOptionC());
                    map.put("optionD", q.getOptionD());
                    // NOTE: correctOption and explanation are NOT included here
                    return map;
                })
                .toList();

        return Map.of("attemptId", attempt.getId(), "questions", safeQuestions);
    }

    // ─────────────────────────────────────────
    // STEP 2: Check a single answer
    // ─────────────────────────────────────────

    /**
     * Checks one answer and returns feedback (isCorrect + explanation).
     * Prevents duplicate answers for the same question in the same attempt.
     */
    @Transactional
    public Map<String, Object> checkAnswer(Long userId, Long attemptId, Long questionId, String selectedOption) {
        // Verify this attempt belongs to this user (prevents cheating across accounts)
        if (!quizAttemptRepository.existsByIdAndUserId(attemptId, userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your quiz attempt.");
        }

        // Prevent re-submitting the same question answer
        if (answerRepository.existsByAttemptIdAndQuestionId(attemptId, questionId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Already answered this question.");
        }

        // Fetch the question from the database
        Question q = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not found"));

        // Check if the answer is correct (this is the ONLY place correctOption is read)
        boolean isCorrect = q.getCorrectOption().equalsIgnoreCase(selectedOption);

        // Save the answer record
        QuizAttemptAnswer answer = new QuizAttemptAnswer();
        answer.setAttemptId(attemptId);
        answer.setQuestionId(questionId);
        answer.setSelectedOption(selectedOption.toUpperCase());
        answer.setIsCorrect(isCorrect);
        answerRepository.save(answer);

        // Return feedback — correctOption is NOW safe to reveal (student already answered)
        return Map.of(
                "isCorrect", isCorrect,
                "correctOption", q.getCorrectOption(),
                "explanation", q.getExplanation() != null ? q.getExplanation() : ""
        );
    }

    // ─────────────────────────────────────────
    // STEP 3: Submit quiz — calculate score + update progress
    // ─────────────────────────────────────────

    /**
     * Finalizes a quiz attempt. Calculates score, updates StudentProgress,
     * awards XP, and checks whether the next topic should unlock.
     */
    @Transactional
    public Map<String, Object> submitQuiz(Long userId, Long attemptId, int timeTaken) {
        // Fetch the attempt
        QuizAttempt attempt = quizAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Attempt not found"));

        // Security: ensure this attempt belongs to the logged-in user
        if (!attempt.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your quiz attempt.");
        }

        // Count correct answers from the stored answer records
        List<QuizAttemptAnswer> answers = answerRepository.findByAttemptId(attemptId);
        long correctCount = answers.stream().filter(QuizAttemptAnswer::getIsCorrect).count();
        int total = attempt.getTotalQuestions();
        double accuracy = total > 0 ? (correctCount * 100.0 / total) : 0.0;
        boolean passed = accuracy >= PASS_THRESHOLD;

        // Update the attempt record
        attempt.setScore((int) correctCount);
        attempt.setAccuracy(accuracy);
        attempt.setTimeTaken(timeTaken);
        attempt.setPassed(passed);
        quizAttemptRepository.save(attempt);

        // Update StudentProgress — only keep the BEST score (retries never reduce progress)
        StudentProgress progress = progressRepository
                .findByUserIdAndTopicId(userId, attempt.getTopicId())
                .orElseGet(() -> {
                    StudentProgress sp = new StudentProgress();
                    sp.setUserId(userId);
                    sp.setTopicId(attempt.getTopicId());
                    sp.setStatus("UNLOCKED");
                    return sp;
                });

        boolean isFirstPass = updateBestScore(progress, attempt.getLevelType(), accuracy, passed);
        progressRepository.save(progress);

        // Award XP: full XP only on first pass, 0 XP for replays of passed levels
        int xpEarned = 0;
        User user = userRepository.findById(userId).orElseThrow();
        if (isFirstPass) {
            xpEarned = (int)(correctCount * XP_PER_CORRECT_ANSWER) + (passed ? XP_PASS_BONUS : 0);
            user.setXp(user.getXp() + xpEarned);
        }

        // Maintain user streak
        int currentStreak = gamificationService.updateStreak(user);

        // Evaluate badges (e.g. First Steps, Quiz Master, Streak)
        List<Map<String, Object>> newBadges = gamificationService.evaluateQuizBadges(
                userId, passed, accuracy, attempt.getLevelType());

        // If Challenge was just passed, unlock the next topic in sequence
        if (passed && "CHALLENGE".equals(attempt.getLevelType())) {
            unlockNextTopic(userId, attempt.getTopicId());
            progress.setStatus("COMPLETED");
            progressRepository.save(progress);
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("score", (int) correctCount);
        response.put("totalQuestions", total);
        response.put("accuracy", accuracy);
        response.put("timeTaken", timeTaken);
        response.put("passed", passed);
        response.put("xpEarned", xpEarned);
        response.put("streakCount", currentStreak);
        response.put("newBadges", newBadges);
        response.put("levelType", attempt.getLevelType());
        return response;
    }

    // ─────────────────────────────────────────
    // Private helper methods
    // ─────────────────────────────────────────

    /**
     * Enforces the unlock rule: Easy → Medium → Hard → Challenge.
     * Throws 403 Forbidden if the requested level is locked.
     */
    private void assertLevelUnlocked(Long userId, Long topicId, String levelType) {
        StudentProgress progress = progressRepository
                .findByUserIdAndTopicId(userId, topicId)
                .orElse(null);

        // First topic in a category is always UNLOCKED (no progress record = unlocked)
        if (progress == null) {
            // Only Easy is allowed without a progress record
            if (!"EASY".equals(levelType)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                        "You must complete Easy first.");
            }
            return;
        }

        // Check lock status based on levelType
        switch (levelType) {
            case "EASY"      -> { /* Always accessible once topic is unlocked */ }
            case "MEDIUM"    -> {
                if (!progress.isEasyPassed())
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                            "Complete Easy with 70%+ first.");
            }
            case "HARD"      -> {
                if (!progress.isMediumPassed())
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                            "Complete Medium with 70%+ first.");
            }
            case "CHALLENGE" -> {
                if (!progress.isHardPassed())
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                            "Complete Hard with 70%+ first.");
            }
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Invalid level type: " + levelType);
        }

        // Also check the topic isn't globally LOCKED
        if ("LOCKED".equals(progress.getStatus())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "This topic is locked. Complete the previous topic's Challenge first.");
        }
    }

    /**
     * Updates the best score for a level. Returns true ONLY if this is
     * the first time the student has passed this level (for XP purposes).
     */
    private boolean updateBestScore(StudentProgress progress, String levelType, double accuracy, boolean passed) {
        boolean wasAlreadyPassed;

        switch (levelType) {
            case "EASY" -> {
                wasAlreadyPassed = progress.isEasyPassed();
                if (accuracy > (progress.getEasyBest() != null ? progress.getEasyBest() : 0.0)) {
                    progress.setEasyBest(accuracy);
                }
            }
            case "MEDIUM" -> {
                wasAlreadyPassed = progress.isMediumPassed();
                if (accuracy > (progress.getMediumBest() != null ? progress.getMediumBest() : 0.0)) {
                    progress.setMediumBest(accuracy);
                }
            }
            case "HARD" -> {
                wasAlreadyPassed = progress.isHardPassed();
                if (accuracy > (progress.getHardBest() != null ? progress.getHardBest() : 0.0)) {
                    progress.setHardBest(accuracy);
                }
            }
            case "CHALLENGE" -> {
                wasAlreadyPassed = progress.isChallengePassed();
                if (accuracy > (progress.getChallengeBest() != null ? progress.getChallengeBest() : 0.0)) {
                    progress.setChallengeBest(accuracy);
                }
            }
            default -> { return false; }
        }

        // Return true only if this is the FIRST pass (XP is awarded once)
        return passed && !wasAlreadyPassed;
    }

    /**
     * After a student passes the Challenge, unlock the next topic in the same category.
     */
    private void unlockNextTopic(Long userId, Long currentTopicId) {
        Topic currentTopic = topicRepository.findById(currentTopicId).orElse(null);
        if (currentTopic == null) return;

        // Find the next topic in sequence
        topicRepository.findByCategoryIdAndSequenceOrder(
                currentTopic.getCategory().getId(),
                currentTopic.getSequenceOrder() + 1
        ).ifPresent(nextTopic -> {
            // Create (or update) progress for the next topic to UNLOCKED
            StudentProgress nextProgress = progressRepository
                    .findByUserIdAndTopicId(userId, nextTopic.getId())
                    .orElseGet(() -> {
                        StudentProgress sp = new StudentProgress();
                        sp.setUserId(userId);
                        sp.setTopicId(nextTopic.getId());
                        return sp;
                    });

            if ("LOCKED".equals(nextProgress.getStatus())) {
                nextProgress.setStatus("UNLOCKED");
                progressRepository.save(nextProgress);
            }
        });
    }
}
