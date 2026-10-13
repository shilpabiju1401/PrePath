package com.preppath.coding;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

/**
 * Judge0Service — communicates with Judge0 API when an API key is provided,
 * or delegates to LocalCodeExecutionService to compile and run genuine code
 * locally using installed Python 3, Java, and GCC compilers.
 */
@Service
public class Judge0Service {

    @Value("${app.judge0.api-url:https://judge0-ce.p.rapidapi.com}")
    private String apiUrl;

    @Value("${app.judge0.api-key:}")
    private String apiKey;

    @Autowired
    private LocalCodeExecutionService localExecutionService;

    private final RestTemplate restTemplate = new RestTemplate();

    public static class ExecutionResult {
        public String status; // ACCEPTED, WRONG_ANSWER, COMPILATION_ERROR, RUNTIME_ERROR, TIME_LIMIT_EXCEEDED
        public String stdout;
        public String stderr;
        public String compileOutput;
        public Double time;
    }

    public int getLanguageId(String language) {
        if ("c".equalsIgnoreCase(language)) return 50;
        if ("java".equalsIgnoreCase(language)) return 62;
        if ("python".equalsIgnoreCase(language)) return 71;
        return 71;
    }

    /**
     * Executes code against an input and checks against expectedOutput.
     */
    public ExecutionResult execute(String language, String code, String input, String expectedOutput) {
        // If Judge0 key is provided, use Judge0 cloud API
        if (apiKey != null && !apiKey.isBlank() && !apiKey.startsWith("your_")) {
            try {
                int langId = getLanguageId(language);
                String submissionUrl = apiUrl + "/submissions?base64_encoded=false&wait=true";

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.set("X-RapidAPI-Key", apiKey);
                headers.set("X-RapidAPI-Host", "judge0-ce.p.rapidapi.com");

                Map<String, Object> body = Map.of(
                        "source_code", code,
                        "language_id", langId,
                        "stdin", input != null ? input : "",
                        "expected_output", expectedOutput != null ? expectedOutput : ""
                );

                HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
                ResponseEntity<Map> response = restTemplate.postForEntity(submissionUrl, request, Map.class);

                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    Map<String, Object> respBody = response.getBody();
                    Map<String, Object> statusObj = (Map<String, Object>) respBody.get("status");
                    int statusId = statusObj != null && statusObj.get("id") != null ? (Integer) statusObj.get("id") : 0;

                    ExecutionResult res = new ExecutionResult();
                    res.stdout = (String) respBody.get("stdout");
                    res.stderr = (String) respBody.get("stderr");
                    res.compileOutput = (String) respBody.get("compile_output");
                    Object timeObj = respBody.get("time");
                    res.time = timeObj != null ? Double.parseDouble(timeObj.toString()) : 0.05;

                    if (statusId == 3) res.status = "ACCEPTED";
                    else if (statusId == 4) res.status = "WRONG_ANSWER";
                    else if (statusId == 6) res.status = "COMPILATION_ERROR";
                    else if (statusId == 5) res.status = "TIME_LIMIT_EXCEEDED";
                    else res.status = "RUNTIME_ERROR";
                    return res;
                }
            } catch (Exception ignored) {}
        }

        // Run genuine code locally with real compiler
        ExecutionResult localRes = localExecutionService.executeLocally(language, code, input);
        if ("ACCEPTED".equals(localRes.status) && expectedOutput != null && !expectedOutput.trim().isEmpty()) {
            String actualOut = localRes.stdout != null ? localRes.stdout.trim() : "";
            if (!actualOut.equals(expectedOutput.trim())) {
                localRes.status = "WRONG_ANSWER";
            }
        }
        return localRes;
    }

    /**
     * Executes arbitrary student code for a learning topic (Free Practice Playground).
     * Runs genuine Python, Java, or C and streams real output back to terminal.
     */
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

        // Check if Judge0 API key configured
        if (apiKey != null && !apiKey.isBlank() && !apiKey.startsWith("your_")) {
            try {
                int langId = getLanguageId(language);
                String submissionUrl = apiUrl + "/submissions?base64_encoded=false&wait=true";

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.set("X-RapidAPI-Key", apiKey);
                headers.set("X-RapidAPI-Host", "judge0-ce.p.rapidapi.com");

                Map<String, Object> body = Map.of(
                        "source_code", code,
                        "language_id", langId,
                        "stdin", stdin != null ? stdin : "",
                        "cpu_time_limit", 5.0,
                        "memory_limit", 128000
                );

                HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
                ResponseEntity<Map> response = restTemplate.postForEntity(submissionUrl, request, Map.class);

                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    Map<String, Object> respBody = response.getBody();
                    Map<String, Object> statusObj = (Map<String, Object>) respBody.get("status");
                    int statusId = statusObj != null && statusObj.get("id") != null ? (Integer) statusObj.get("id") : 0;

                    ExecutionResult res = new ExecutionResult();
                    res.stdout = (String) respBody.get("stdout");
                    res.stderr = (String) respBody.get("stderr");
                    res.compileOutput = (String) respBody.get("compile_output");
                    Object timeObj = respBody.get("time");
                    res.time = timeObj != null ? Double.parseDouble(timeObj.toString()) : 0.05;

                    if (statusId == 3) res.status = "ACCEPTED";
                    else if (statusId == 6) res.status = "COMPILATION_ERROR";
                    else if (statusId == 5) res.status = "TIME_LIMIT_EXCEEDED";
                    else res.status = "RUNTIME_ERROR";
                    return res;
                }
            } catch (Exception ignored) {}
        }

        // Execute genuine code locally
        return localExecutionService.executeLocally(language, code, stdin);
    }
}
