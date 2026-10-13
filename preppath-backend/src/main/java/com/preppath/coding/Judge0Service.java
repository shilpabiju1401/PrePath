
package com.preppath.coding;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
public class Judge0Service {

    @Value("${app.judge0.api-url:https://judge0-ce.p.rapidapi.com}")
    private String rapidApiUrl;

    @Value("${app.judge0.api-key:}")
    private String apiKey;

    @Value("${app.judge0.rapidapi-host:judge0-ce.p.rapidapi.com}")
    private String rapidApiHost;

    @Value("${app.judge0.ce-url:https://ce.judge0.com}")
    private String ceUrl;

    private final RestTemplate restTemplate;

    public Judge0Service() {
        org.springframework.http.client.SimpleClientHttpRequestFactory factory =
                new org.springframework.http.client.SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(8000);
        factory.setReadTimeout(15000);
        this.restTemplate = new RestTemplate(factory);
    }

    public static class ExecutionResult {
        public String status;
        public String stdout;
        public String stderr;
        public String compileOutput;
        public Double time;
    }

    public int getLanguageId(String language) {
        if (language == null) {
            throw new IllegalArgumentException("Language is required.");
        }

        switch (language.trim().toLowerCase()) {
            case "c":
                return 103;
            case "java":
                return 91;
            case "python":
            case "python3":
                return 100;
            default:
                throw new IllegalArgumentException(
                    "Unsupported language: " + language
                );
        }
    }

    private Map<String, Object> submitToJudge0(
            String baseUrl,
            String key,
            int languageId,
            String code,
            String stdin,
            String expectedOutput,
            Double cpuLimit,
            Integer memoryLimit) {

        try {
            String url = baseUrl.replaceAll("/+$", "")
                + "/submissions?base64_encoded=false&wait=true";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) PrepPath/1.0");
            headers.set("Accept", "application/json");

            if (key != null && !key.isBlank()) {
                headers.set("X-RapidAPI-Key", key);
                headers.set("X-RapidAPI-Host", rapidApiHost);
            }

            Map<String, Object> body = new LinkedHashMap<>();
            body.put("source_code", code);
            body.put("language_id", languageId);
            body.put("stdin", stdin == null ? "" : stdin);

            if (expectedOutput != null && !expectedOutput.isBlank()) {
                body.put("expected_output", expectedOutput);
            }

            if (cpuLimit != null) {
                body.put("cpu_time_limit", cpuLimit);
            }

            if (memoryLimit != null) {
                body.put("memory_limit", memoryLimit);
            }

            HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                url, request, Map.class
            );

            if (response.getStatusCode().is2xxSuccessful()
                    && response.getBody() != null) {
                return response.getBody();
            }

            System.err.println(
                "Judge0 returned HTTP status: "
                    + response.getStatusCode()
            );

        } catch (RestClientException e) {
            System.err.println(
                "Judge0 request failed for language ID "
                    + languageId + ": " + e.getMessage()
            );
        }

        return null;
    }

    private ExecutionResult errorResult(String message) {
        ExecutionResult result = new ExecutionResult();
        result.status = "RUNTIME_ERROR";
        result.stderr = message;
        result.time = 0.0;
        return result;
    }

    private ExecutionResult toResult(
            Map<String, Object> response,
            String expectedOutput) {

        ExecutionResult result = new ExecutionResult();

        result.stdout = (String) response.get("stdout");
        result.stderr = (String) response.get("stderr");
        result.compileOutput =
            (String) response.get("compile_output");

        Object time = response.get("time");
        try {
            result.time = time == null
                ? 0.0
                : Double.parseDouble(time.toString());
        } catch (NumberFormatException e) {
            result.time = 0.0;
        }

        Object statusObject = response.get("status");
        int statusId = 0;

        if (statusObject instanceof Map) {
            Object id = ((Map<?, ?>) statusObject).get("id");

            if (id instanceof Number) {
                statusId = ((Number) id).intValue();
            }
        }

        switch (statusId) {
            case 1:
                result.status = "IN_QUEUE";
                break;
            case 2:
                result.status = "PROCESSING";
                break;
            case 3:
                result.status = "ACCEPTED";
                break;
            case 4:
                result.status = "WRONG_ANSWER";
                break;
            case 5:
                result.status = "TIME_LIMIT_EXCEEDED";
                break;
            case 6:
                result.status = "COMPILATION_ERROR";
                break;
            case 7:
                result.status = "RUNTIME_ERROR";
                break;
            case 8:
                result.status = "RUNTIME_ERROR";
                break;
            case 9:
                result.status = "RUNTIME_ERROR";
                break;
            case 10:
                result.status = "RUNTIME_ERROR";
                break;
            case 11:
                result.status = "RUNTIME_ERROR";
                break;
            case 12:
                result.status = "RUNTIME_ERROR";
                break;
            case 13:
                result.status = "RUNTIME_ERROR";
                break;
            default:
                result.status = "RUNTIME_ERROR";
                if (result.stderr == null) {
                    result.stderr =
                        "Judge0 returned an unexpected execution status.";
                }
        }

        // Some Judge0 configurations do not compare expected output.
        if ("ACCEPTED".equals(result.status)
                && expectedOutput != null
                && !expectedOutput.isBlank()) {

            String actual = result.stdout == null
                ? "" : result.stdout.trim();

            if (!actual.equals(expectedOutput.trim())) {
                result.status = "WRONG_ANSWER";
            }
        }

        return result;
    }

    private ExecutionResult executeWithJudge0(
            String language,
            String code,
            String input,
            String expectedOutput,
            Double cpuLimit,
            Integer memoryLimit) {

        if (code == null || code.isBlank()) {
            return errorResult("Please enter your code.");
        }

        final int languageId;

        try {
            languageId = getLanguageId(language);
        } catch (IllegalArgumentException e) {
            return errorResult(e.getMessage());
        }

        Map<String, Object> response = null;

        // Prefer RapidAPI when a real API key is configured.
        if (apiKey != null
                && !apiKey.isBlank()
                && !apiKey.startsWith("your_")) {

            response = submitToJudge0(
                rapidApiUrl, apiKey, languageId,
                code, input, expectedOutput,
                cpuLimit, memoryLimit
            );
        }

        // Use the public CE instance if RapidAPI is not configured
        // or its request fails.
        if (response == null) {
            response = submitToJudge0(
                ceUrl, null, languageId,
                code, input, expectedOutput,
                cpuLimit, memoryLimit
            );
        }

        if (response == null) {
            return errorResult(
                "Judge0 is unavailable. Check your Render logs, "
                + "API URL, API key, and Judge0 service availability."
            );
        }

        return toResult(response, expectedOutput);
    }

    // Used by coding challenges.
    public ExecutionResult execute(
            String language,
            String code,
            String input,
            String expectedOutput) {

        return executeWithJudge0(
            language, code, input, expectedOutput, null, null
        );
    }

    // Used by the learning playground.
    public ExecutionResult executePlayground(
            String language,
            String code,
            String stdin) {

        if (code != null && code.length() > 65536) {
            return errorResult(
                "Code size exceeds the maximum limit of 64 KB."
            );
        }

        return executeWithJudge0(
            language, code, stdin, null, 5.0, 128000
        );
    }
}
