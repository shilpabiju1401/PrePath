package com.preppath.coding.learn;

import com.preppath.coding.Judge0Service;
import com.preppath.progress.StudentProgress;
import com.preppath.progress.StudentProgressRepository;
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

/**
 * LearnCodingController — Learn-First, Free Practice coding module:
 *
 * GET  /api/coding/levels                   — roadmaps for Levels 1-4 with topic lists
 * GET  /api/coding/topics/{topicId}          — sections, code examples, visualizer, nextTopicId
 * POST /api/coding/topics/{topicId}/complete — Next button: awards 10 XP first time only
 * POST /api/coding/run                       — free practice run with backend XP check
 */
@RestController
@RequestMapping("/api/coding")
public class LearnCodingController {

    @Autowired private CodingTopicRepository        codingTopicRepository;
    @Autowired private TopicSectionRepository        topicSectionRepository;
    @Autowired private TopicCodeExampleRepository    topicCodeExampleRepository;
    @Autowired private TopicVisualizationRepository  topicVisualizationRepository;
    @Autowired private CodingRunRepository           codingRunRepository;
    @Autowired private TopicCompletionRepository     completionRepository;
    @Autowired private StudentProgressRepository     progressRepository;
    @Autowired private UserRepository                userRepository;
    @Autowired private Judge0Service                 judge0Service;

    record PlaygroundRunRequest(Long topicId, String language, String code, String stdin) {}

    // ── GET /api/coding/levels ─────────────────────────────────────────────────
    @GetMapping("/levels")
    public ResponseEntity<?> getRoadmapLevels(Authentication auth) {
        User user = (User) auth.getPrincipal();
        List<CodingTopic> allTopics = codingTopicRepository.findAllByOrderByLevelNumberAscSequenceOrderAsc();

        // Get all completed topic IDs for this user
        Set<Long> completedTopicIds = new HashSet<>();
        if (user != null) {
            List<TopicCompletion> completions = completionRepository.findByUserId(user.getId());
            for (TopicCompletion tc : completions) {
                completedTopicIds.add(tc.getTopicId());
            }
        }

        String[] levelTitles = {
            "Level 1: Programming Basics",
            "Level 2: Core DSA",
            "Level 3: Intermediate DSA",
            "Level 4: Advanced DSA"
        };
        String[] levelDescriptions = {
            "Variables, data types, operators, I/O, conditions, loops, and functions",
            "Arrays, strings, searching, sorting, complexity, and basic recursion",
            "Linked lists, stacks, queues, hashing, binary search, two pointers",
            "Trees, BSTs, heaps, graphs, backtracking, greedy, and dynamic programming"
        };

        List<Map<String, Object>> levels = new ArrayList<>();
        boolean previousLevelCompleted = true; // Level 1 is always unlocked

        for (int i = 1; i <= 4; i++) {
            final int lvl = i;
            List<CodingTopic> lvlTopics = allTopics.stream()
                    .filter(t -> t.getLevelNumber() == lvl).toList();

            long completedCount = lvlTopics.stream()
                    .filter(t -> completedTopicIds.contains(t.getId()))
                    .count();

            boolean isUnlocked = (lvl == 1) || previousLevelCompleted;
            boolean isLevelComplete = !lvlTopics.isEmpty() && completedCount == lvlTopics.size();

            // Enrich topics with completed flag
            List<Map<String, Object>> enrichedTopics = new ArrayList<>();
            for (CodingTopic t : lvlTopics) {
                Map<String, Object> tMap = new LinkedHashMap<>();
                tMap.put("id", t.getId());
                tMap.put("name", t.getName());
                tMap.put("sequenceOrder", t.getSequenceOrder());
                tMap.put("summary", t.getSummary());
                tMap.put("levelNumber", t.getLevelNumber());
                tMap.put("completed", completedTopicIds.contains(t.getId()));
                enrichedTopics.add(tMap);
            }

            Map<String, Object> lvlMap = new LinkedHashMap<>();
            lvlMap.put("levelNumber",     lvl);
            lvlMap.put("title",           levelTitles[lvl - 1]);
            lvlMap.put("description",     levelDescriptions[lvl - 1]);
            lvlMap.put("topicCount",      lvlTopics.size());
            lvlMap.put("completedCount",  completedCount);
            lvlMap.put("isUnlocked",      isUnlocked);
            lvlMap.put("isCompleted",     isLevelComplete);
            lvlMap.put("topics",          enrichedTopics);
            levels.add(lvlMap);

            // Update for the next level
            previousLevelCompleted = isLevelComplete;
        }
        return ResponseEntity.ok(levels);
    }

    // ── GET /api/coding/topics/{topicId} ──────────────────────────────────────
    @GetMapping("/topics/{topicId}")
    public ResponseEntity<?> getTopicDetails(@PathVariable Long topicId, Authentication auth) {
        CodingTopic topic = codingTopicRepository.findById(topicId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Coding topic not found"));

        User user = (User) auth.getPrincipal();

        // ── Enforce level progression lock ────────────────────────────────────
        if (topic.getLevelNumber() > 1 && user != null) {
            Set<Long> completedTopicIds = new HashSet<>();
            for (TopicCompletion tc : completionRepository.findByUserId(user.getId())) {
                completedTopicIds.add(tc.getTopicId());
            }

            // Check if all preceding levels are fully completed
            for (int lvl = 1; lvl < topic.getLevelNumber(); lvl++) {
                final int l = lvl;
                List<CodingTopic> prevLevelTopics = codingTopicRepository.findAllByOrderByLevelNumberAscSequenceOrderAsc()
                        .stream().filter(t -> t.getLevelNumber() == l).toList();
                boolean allDone = !prevLevelTopics.isEmpty() && prevLevelTopics.stream().allMatch(t -> completedTopicIds.contains(t.getId()));
                if (!allDone) {
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
                        "Level " + topic.getLevelNumber() + " is locked! Please complete all topics in Level " + lvl + " first.");
                }
            }
        }

        List<TopicSection>           sections     = topicSectionRepository.findByTopicIdOrderBySortOrderAsc(topicId);
        List<TopicCodeExample>       codeExamples = topicCodeExampleRepository.findByTopicIdOrderBySortOrderAsc(topicId);
        Optional<TopicVisualization> vizOpt       = topicVisualizationRepository.findByTopicId(topicId);

        // ── Find next topic in global sequence ───────────────────────────────
        List<CodingTopic> allTopics = codingTopicRepository.findAllByOrderByLevelNumberAscSequenceOrderAsc();
        Long nextTopicId = null;
        for (int i = 0; i < allTopics.size() - 1; i++) {
            if (allTopics.get(i).getId().equals(topicId)) {
                nextTopicId = allTopics.get(i + 1).getId();
                break;
            }
        }

        // ── Per-user completion / practice state ─────────────────────────────
        boolean alreadyCompleted = completionRepository.existsByUserIdAndTopicId(user.getId(), topicId);
        boolean alreadyPracticed = codingRunRepository.existsByUserIdAndTopicIdAndStatus(
                user.getId(), topicId, "ACCEPTED");

        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("id",               topic.getId());
        resp.put("levelNumber",      topic.getLevelNumber());
        resp.put("name",             topic.getName());
        resp.put("sequenceOrder",    topic.getSequenceOrder());
        resp.put("summary",          topic.getSummary());
        resp.put("sections",         sections);
        resp.put("codeExamples",     codeExamples);
        resp.put("alreadyPracticed", alreadyPracticed);
        resp.put("alreadyCompleted", alreadyCompleted);
        resp.put("nextTopicId",      nextTopicId);   // null if last topic

        vizOpt.ifPresent(v -> resp.put("visualization",
                Map.of("vizType", v.getVizType(), "stepsJson", v.getStepsJson())));

        return ResponseEntity.ok(resp);
    }

    // ── POST /api/coding/topics/{topicId}/complete ────────────────────────────
    /**
     * Called when the student clicks "Next Topic →" after reading the topic.
     * Awards 10 XP the FIRST time only. Idempotent — repeat calls return 0 XP.
     */
    @PostMapping("/topics/{topicId}/complete")
    public ResponseEntity<?> completeTopic(@PathVariable Long topicId, Authentication auth) {
        User user = (User) auth.getPrincipal();
        User freshUser = userRepository.findById(user.getId()).orElseThrow();

        boolean alreadyCompleted = completionRepository.existsByUserIdAndTopicId(freshUser.getId(), topicId);

        int xpAwarded = 0;

        if (!alreadyCompleted) {
            // First completion — award 10 XP
            xpAwarded = 10;
            freshUser.setXp(freshUser.getXp() + xpAwarded);
            userRepository.save(freshUser);

            TopicCompletion tc = new TopicCompletion();
            tc.setUserId(freshUser.getId());
            tc.setTopicId(topicId);
            tc.setCompletedAt(LocalDateTime.now());
            completionRepository.save(tc);
        }

        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("xpAwarded",        xpAwarded);
        resp.put("totalXp",          freshUser.getXp());
        resp.put("alreadyCompleted", alreadyCompleted);

        return ResponseEntity.ok(resp);
    }

    // ── POST /api/coding/run ──────────────────────────────────────────────────
    @PostMapping("/run")
    public ResponseEntity<?> runPlaygroundCode(@RequestBody PlaygroundRunRequest req, Authentication auth) {
        User user = (User) auth.getPrincipal();
        Long topicId = req.topicId();

        Judge0Service.ExecutionResult exec = judge0Service.executePlayground(
                req.language(), req.code(), req.stdin());

        boolean isSuccessful = "ACCEPTED".equals(exec.status)
                && exec.stdout != null
                && !exec.stdout.trim().isEmpty();

        int xpAwarded = 0;
        boolean isFirstSuccess = false;

        if (isSuccessful) {
            boolean alreadyEarned = codingRunRepository.existsByUserIdAndTopicIdAndStatus(
                    user.getId(), topicId, "ACCEPTED");

            if (!alreadyEarned) {
                isFirstSuccess = true;
                xpAwarded = 10;

                User freshUser = userRepository.findById(user.getId()).orElseThrow();
                freshUser.setXp(freshUser.getXp() + xpAwarded);
                userRepository.save(freshUser);

                StudentProgress sp = progressRepository.findByUserIdAndTopicId(user.getId(), topicId).orElse(null);
                if (sp != null) { sp.setPracticed(true); progressRepository.save(sp); }
            }
        }

        CodingRun run = new CodingRun();
        run.setUserId(user.getId());
        run.setTopicId(topicId);
        run.setLanguage(req.language());
        run.setCode(req.code());
        run.setStdin(req.stdin());
        run.setStatus(exec.status);
        run.setStdout(exec.stdout);
        run.setStderr(exec.stderr != null ? exec.stderr : exec.compileOutput);
        run.setRuntime(exec.time);
        run.setXpAwarded(xpAwarded);
        run.setCreatedAt(LocalDateTime.now());
        codingRunRepository.save(run);

        String friendlyErrorHint = null;
        if (!isSuccessful) {
            if ("COMPILATION_ERROR".equals(exec.status))
                friendlyErrorHint = "Tip: Check for missing semicolons, parentheses, or typos in keywords.";
            else if ("TIME_LIMIT_EXCEEDED".equals(exec.status))
                friendlyErrorHint = "Tip: Make sure your loops have an exit condition so they don't run forever.";
            else if ("RUNTIME_ERROR".equals(exec.status))
                friendlyErrorHint = "Tip: Check array boundary indices and watch out for division by zero.";
        }

        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("status",            exec.status);
        resp.put("isSuccessful",      isSuccessful);
        resp.put("stdout",            exec.stdout);
        resp.put("stderr",            exec.stderr != null ? exec.stderr : exec.compileOutput);
        resp.put("runtime",           exec.time);
        resp.put("xpAwarded",         xpAwarded);
        resp.put("isFirstSuccess",    isFirstSuccess);
        resp.put("friendlyErrorHint", friendlyErrorHint);

        return ResponseEntity.ok(resp);
    }
}
