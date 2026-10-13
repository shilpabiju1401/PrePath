package com.preppath.coding;

import com.preppath.badge.GamificationService;
import com.preppath.user.User;
import com.preppath.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

/**
 * CodingController — REST endpoints for the coding playground and DSA problems.
 *
 * GET  /api/coding/topics                   — list DSA topics & roadmaps
 * GET  /api/coding/problems/{problemId}     — problem details + starter code + visible tests
 * POST /api/coding/run                      — run code against sample/custom input
 * POST /api/coding/submit                   — evaluate code against all test cases (hidden on backend)
 */
@RestController
@RequestMapping("/api/coding/challenges")
public class CodingController {

    @Autowired private CodingProblemRepository problemRepository;
    @Autowired private CodingTestCaseRepository testCaseRepository;
    @Autowired private CodingSubmissionRepository submissionRepository;
    @Autowired private Judge0Service judge0Service;
    @Autowired private UserRepository userRepository;
    @Autowired private GamificationService gamificationService;

    record RunRequest(Long problemId, String language, String code, String customInput) {}
    record SubmitRequest(Long problemId, String language, String code) {}

    @GetMapping("/topics")
    public ResponseEntity<?> getCodingTopics() {
        return ResponseEntity.ok(List.of(
            Map.of("id", 101L, "name", "Variables & I/O",      "dsaLevel", 1, "problemCount", 2),
            Map.of("id", 102L, "name", "Loops & Conditions",   "dsaLevel", 1, "problemCount", 2),
            Map.of("id", 103L, "name", "Arrays & Vectors",     "dsaLevel", 2, "problemCount", 3),
            Map.of("id", 104L, "name", "Strings & Characters", "dsaLevel", 2, "problemCount", 2)
        ));
    }

    @GetMapping("/topics/{topicId}/problems")
    public ResponseEntity<?> getProblemsByTopic(@PathVariable Long topicId) {
        List<CodingProblem> problems = problemRepository.findByTopicId(topicId);
        return ResponseEntity.ok(problems);
    }

    @GetMapping("/problems/{problemId}")
    public ResponseEntity<?> getProblemDetail(@PathVariable Long problemId, Authentication auth) {
        CodingProblem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Problem not found"));

        List<CodingTestCase> visibleCases = testCaseRepository.findByProblemIdAndIsHiddenFalse(problemId);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("id", problem.getId());
        response.put("title", problem.getTitle());
        response.put("statement", problem.getStatement());
        response.put("constraints", problem.getConstraints());
        response.put("difficulty", problem.getDifficulty());
        response.put("sampleInput", problem.getSampleInput());
        response.put("sampleOutput", problem.getSampleOutput());
        response.put("starterCodeC", problem.getStarterCodeC());
        response.put("starterCodeJava", problem.getStarterCodeJava());
        response.put("starterCodePython", problem.getStarterCodePython());
        response.put("hints", problem.getHints());
        response.put("sampleTestCases", visibleCases);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/run")
    public ResponseEntity<?> runCode(@RequestBody RunRequest req) {
        CodingProblem problem = problemRepository.findById(req.problemId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Problem not found"));

        String input = req.customInput() != null && !req.customInput().isBlank()
                ? req.customInput()
                : problem.getSampleInput();

        Judge0Service.ExecutionResult result = judge0Service.execute(
                req.language(), req.code(), input, problem.getSampleOutput());

        return ResponseEntity.ok(result);
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitCode(@RequestBody SubmitRequest req, Authentication auth) {
        User user = (User) auth.getPrincipal();
        Long problemId = req.problemId();

        CodingProblem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Problem not found"));

        List<CodingTestCase> allCases = testCaseRepository.findByProblemId(problemId);
        if (allCases.isEmpty()) {
            // Default fallback if no test cases seeded
            allCases = List.of(new CodingTestCase());
            allCases.get(0).setInput(problem.getSampleInput());
            allCases.get(0).setExpectedOutput(problem.getSampleOutput());
            allCases.get(0).setIsHidden(false);
        }

        String finalStatus = "ACCEPTED";
        Double totalRuntime = 0.0;
        int passedCount = 0;
        String errorMessage = null;

        for (CodingTestCase tc : allCases) {
            Judge0Service.ExecutionResult exec = judge0Service.execute(
                    req.language(), req.code(), tc.getInput(), tc.getExpectedOutput());

            totalRuntime += exec.time != null ? exec.time : 0.05;

            if (!"ACCEPTED".equals(exec.status)) {
                finalStatus = exec.status;
                errorMessage = exec.stderr != null ? exec.stderr : exec.compileOutput;
                break;
            }
            passedCount++;
        }

        // Save submission
        CodingSubmission submission = new CodingSubmission();
        submission.setUserId(user.getId());
        submission.setProblemId(problemId);
        submission.setLanguage(req.language());
        submission.setCode(req.code());
        submission.setStatus(finalStatus);
        submission.setRuntime(totalRuntime);
        submissionRepository.save(submission);

        // Award XP on FIRST accepted solution only
        int xpEarned = 0;
        boolean isFirstAccepted = false;
        if ("ACCEPTED".equals(finalStatus)) {
            boolean alreadySolved = submissionRepository.existsByUserIdAndProblemIdAndStatus(
                    user.getId(), problemId, "ACCEPTED");

            // Award XP if this is the first accepted submission
            if (!alreadySolved || submissionRepository.findByUserIdAndProblemIdOrderByCreatedAtDesc(user.getId(), problemId).size() <= 1) {
                isFirstAccepted = true;
                xpEarned = 30; // 30 XP per coding problem
                User refreshedUser = userRepository.findById(user.getId()).orElseThrow();
                refreshedUser.setXp(refreshedUser.getXp() + xpEarned);
                userRepository.save(refreshedUser);
            }

            // Award "Coding Explorer" badge if eligible
            gamificationService.awardBadgeIfEligible(user.getId(), "FIRST_CODE_ACCEPTED");
        }

        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("status", finalStatus);
        resp.put("passedCount", passedCount);
        resp.put("totalCount", allCases.size());
        resp.put("runtime", totalRuntime);
        resp.put("xpEarned", xpEarned);
        resp.put("isFirstAccepted", isFirstAccepted);
        resp.put("error", errorMessage);

        return ResponseEntity.ok(resp);
    }
}
