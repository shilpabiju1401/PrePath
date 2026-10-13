package com.preppath.coding;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Judge0Service — executes student code using one of three strategies (in order):
 *
 *  1. RapidAPI Judge0 key (app.judge0.api-key)  — if configured in env/application.yml
 *  2. ce.judge0.com free public instance         — no key required, works on any host (Render, etc.)
 *  3. LocalCodeExecutionService                  — last-resort: needs python3/gcc/java on PATH
 */
@Service
public class Judge0Service {

    /** RapidAPI Judge0 URL — only used when an API key is set. */
    @Value("${app.judge0.api-url:https://judge0-ce.p.rapidapi.com}")
    private String rapidApiUrl;

    /** Optional RapidAPI key. Leave blank to use the free ce.judge0.com fallback. */
    @Value("${app.judge0.api-key:}")
    private String apiKey;

    /** Free public Judge0 CE instance — no key or quota required. */
    private static final String CE_URL = "https://ce.judge0.com";

    @Autowired
    private LocalCodeExecutionService localExecutionService;

    private final RestTemplate restTemplate = new RestTemplate();

    // ── Result DTO ─────────────────────────────────────────────────────────────
    public static class ExecutionResult {
        /** ACCEPTED | WRONG_ANSWER | COMPILATION_ERROR | RUNTIME_ERROR | TIME_LIMIT_EXCEEDED */
        public String status;
        public String stdout;
        public String stderr;
        public String compileOutput;
        public Double time;
    }

    // ── Language IDs (ce.judge0.com + RapidAPI Judge0) ─────────────────────────
    /**
     * Returns the Judge0 language ID.
     * Uses modern IDs that are present on both ce.judge0.com and RapidAPI Judge0-CE.
     *   C      → 103  (C GCC 14.1.0)
     *   Java   → 91   (Java JDK 17)
     *   Python → 100  (Python 3.12.5)
     */
    public int getLanguageId(String language) {
        if ("c".equalsIgnoreCase(language))      return 103;
        if ("java".equalsIgnoreCase(language))   return 91;
        if ("python".equalsIgnoreCase(language)) return 100;
        return 100; // default Python
    }

    // ── Shared HTTP helper ─────────────────────────────────────────────────────
    /**
     * POSTs a submission to the given Judge0 base URL.
     * If rapidApiKey is non-null/non-blank, attaches RapidAPI headers.
     * Returns the parsed response map, or null on any failure.
     */
    @SuppressWarnings("unchecked")
    private Map<String, Object> submitToJudge0(
            String baseUrl, String rapidApiKey, int langId,
            String code, String stdin, String expectedOutput,
            Double cpuLimit, Integer memLimit) {
        try {
            String submissionUrl = baseUrl + "/submissions?base64_encoded=false&wait=true";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            if (rapidApiKey != null && !rapidApiKey.isBlank()) {
                headers.set("X-RapidAPI-Key", rapidApiKey);
                headers.set("X-RapidAPI-Host", "judge0-ce.p.rapidapi.com");
            }

            Map<String, Object> body = new LinkedHashMap<>();
            body.put("source_code", code);
            body.put("language_id", langId);
            body.put("stdin", stdin != null ? stdin : "");
            if (expectedOutput != null && !expectedOutput.isBlank())
                body.put("expected_output", expectedOutput);
            if (cpuLimit != null)  body.put("cpu_time_limit", cpuLimit);
            if (memLimit != null)  body.put("memory_limit", memLimit);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(submissionUrl, request, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return (Map<String, Object>) response.getBody();
            }
        } catch (Exception ignored) {}
        return null;
    }

    /** Maps a Judge0 status ID to our internal status string. */
    private String mapStatus(int statusId, boolean isExecute) {
        return switch (statusId) {
            case 3  -> "ACCEPTED";
            case 4  -> isExecute ? "WRONG_ANSWER" : "RUNTIME_ERROR";
            case 5  -> "TIME_LIMIT_EXCEEDED";
            case 6  -> "COMPILATION_ERROR";
            default -> "RUNTIME_ERROR";
        };
    }

    /** Converts a raw Judge0 response map into an ExecutionResult. */
    private ExecutionResult toResult(Map<String, Object> respBody, boolean isExecute) {
        ExecutionResult res = new ExecutionResult();
        res.stdout        = (String) respBody.get("stdout");
        res.stderr        = (String) respBody.get("stderr");
        res.compileOutput = (String) respBody.get("compile_output");
        Object timeObj    = respBody.get("time");
        res.time          = timeObj != null ? Double.parseDouble(timeObj.toString()) : 0.05;

        Map<String, Object> statusObj = (Map<String, Object>) respBody.get("status");
        int statusId = (statusObj != null && statusObj.get("id") != null)
                       ? ((Number) statusObj.get("id")).intValue() : 0;
        res.status = mapStatus(statusId, isExecute);
        return res;
    }

    // ══════════════════════════════════════════════════════════════════════════
    // execute()  —  used by coding CHALLENGES (checks expectedOutput)
    // ══════════════════════════════════════════════════════════════════════════
    public ExecutionResult execute(String language, String code, String input, String expectedOutput) {
        int langId = getLanguageId(language);

        // 1️⃣ RapidAPI key provided → prefer it
        if (apiKey != null && !apiKey.isBlank() && !apiKey.startsWith("your_")) {
            Map<String, Object> resp = submitToJudge0(
                rapidApiUrl, apiKey, langId, code, input, expectedOutput, null, null);
            if (resp != null) {
                return toResult(resp, true);
            }
        }

        // 2️⃣ Free ce.judge0.com (no key, no quota — works on Render)
        {
            Map<String, Object> resp = submitToJudge0(
                CE_URL, null, langId, code, input, expectedOutput, null, null);
            if (resp != null) {
                ExecutionResult res = toResult(resp, true);
                // If ce.judge0.com returned ACCEPTED but output doesn't match → WRONG_ANSWER
                if ("ACCEPTED".equals(res.status) && expectedOutput != null && !expectedOutput.trim().isEmpty()) {
                    String actual = res.stdout != null ? res.stdout.trim() : "";
                    if (!actual.equals(expectedOutput.trim())) res.status = "WRONG_ANSWER";
                }
                return res;
            }
        }

        // 3️⃣ Last resort: local compilers (only works if python3/gcc/java are on PATH)
        ExecutionResult localRes = localExecutionService.executeLocally(language, code, input);
        if ("ACCEPTED".equals(localRes.status) && expectedOutput != null && !expectedOutput.trim().isEmpty()) {
            String actual = localRes.stdout != null ? localRes.stdout.trim() : "";
            if (!actual.equals(expectedOutput.trim())) localRes.status = "WRONG_ANSWER";
        }
        return localRes;
    }

    // ══════════════════════════════════════════════════════════════════════════
    // executePlayground()  —  used by the LEARNING playground (free-run)
    // ══════════════════════════════════════════════════════════════════════════
    public ExecutionResult executePlayground(String language, String code, String stdin) {
        if (code == null || code.trim().isEmpty()) {
            ExecutionResult res = new ExecutionResult();
            res.status = "COMPILATION_ERROR";
            res.compileOutput = "Your code is empty! Try writing a simple print statement to get started.";
            res.time = 0.0;
            return res;
        }

        if (code.length() > 65536) {
            ExecutionResult res = new ExecutionResult();
            res.status = "COMPILATION_ERROR";
            res.compileOutput = "Code size exceeds the maximum allowed limit of 64 KB.";
            res.time = 0.0;
            return res;
        }

        int langId = getLanguageId(language);

        // 1️⃣ RapidAPI key
        if (apiKey != null && !apiKey.isBlank() && !apiKey.startsWith("your_")) {
            Map<String, Object> resp = submitToJudge0(
                rapidApiUrl, apiKey, langId, code, stdin, null, 5.0, 128000);
            if (resp != null) return toResult(resp, false);
        }

        // 2️⃣ Free ce.judge0.com
        {
            Map<String, Object> resp = submitToJudge0(
                CE_URL, null, langId, code, stdin, null, 5.0, 128000);
            if (resp != null) return toResult(resp, false);
        }

        // 3️⃣ Local fallback
        return localExecutionService.executeLocally(language, code, stdin);
    }
}
