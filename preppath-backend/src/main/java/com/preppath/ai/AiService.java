package com.preppath.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

/**
 * AiService — connects to external LLM API to provide mentoring, hints, and error explanations.
 * Falls back to an intelligent heuristic tutor if no external API key is set.
 */
@Service
public class AiService {

    @Value("${app.ai.api-url:https://api.openai.com/v1/chat/completions}")
    private String apiUrl;

    @Value("${app.ai.api-key:}")
    private String apiKey;

    @Value("${app.ai.model:gpt-4o-mini}")
    private String model;

    private final RestTemplate restTemplate;

    public AiService() {
        org.springframework.http.client.SimpleClientHttpRequestFactory factory = 
                new org.springframework.http.client.SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(8000);
        factory.setReadTimeout(12000);
        this.restTemplate = new RestTemplate(factory);
    }

    public String askAi(String question, String contextTopic) {
        String cleanKey = apiKey != null ? apiKey.trim() : "";
        if (!cleanKey.isEmpty() && !cleanKey.startsWith("your_")) {
            try {
                if (cleanKey.startsWith("AIza") || cleanKey.startsWith("AQ.") || apiUrl.contains("googleapis.com")) {
                    return callGemini(question, contextTopic, cleanKey);
                } else {
                    return callOpenAiCompatible(question, contextTopic, cleanKey);
                }
            } catch (Exception e) {
                // If API quota exceeded or connection failed, fall through to intelligent tutor simulation
                System.err.println("AI API call failed, falling back to local tutor: " + e.getMessage());
            }
        }

        return generateTutorResponse(question, contextTopic);
    }

    private String callGemini(String question, String contextTopic, String key) {
        String modelName = (model != null && !model.isBlank() && !model.contains("gpt")) ? model : "gemini-3.8-flash";
        String url = apiUrl;
        if (!url.contains("googleapis.com")) {
            url = "https://generativelanguage.googleapis.com/v1beta/models/" + modelName + ":generateContent";
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-goog-api-key", key);

        String prompt = "You are Pip & Bloop, the friendly AI mentors for PrepPath campus placement prep. "
                + "Help the student with Quantitative Aptitude, Logical Reasoning, Verbal, or Coding (C, C++, Java, Python). "
                + "Provide clear, encouraging, step-by-step explanations. When they ask for code or solutions, provide correct, working, and well-commented code.\n\n"
                + (contextTopic != null && !contextTopic.isBlank() ? "Context Topic: " + contextTopic + "\n" : "")
                + "Student Question: " + question;

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", prompt)))
                )
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<Map> resp = restTemplate.postForEntity(url, entity, Map.class);
        if (resp.getStatusCode().is2xxSuccessful() && resp.getBody() != null) {
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) resp.getBody().get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                Map<String, Object> candidate = candidates.get(0);
                Map<String, Object> content = (Map<String, Object>) candidate.get("content");
                if (content != null) {
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                    if (parts != null && !parts.isEmpty()) {
                        return (String) parts.get(0).get("text");
                    }
                }
            }
        }
        throw new RuntimeException("Empty response from Gemini API");
    }

    private String callOpenAiCompatible(String question, String contextTopic, String key) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(key);

        String systemPrompt = "You are Pip & Bloop, the friendly AI mentors for PrepPath campus placement prep. "
                + "Help the student with Aptitude, Reasoning, Verbal, or Coding. "
                + "Provide clear step-by-step explanations. If asked for code, bug fixes, or solutions, provide correct, working, well-commented code and explain the intuition and complexities.";

        String targetUrl = apiUrl;
        String selectedModel = (model != null && !model.isBlank()) ? model : "gpt-4o-mini";

        if (key.startsWith("gsk_") || apiUrl.contains("groq.com")) {
            if (!targetUrl.contains("groq.com")) {
                targetUrl = "https://api.groq.com/openai/v1/chat/completions";
            }
            if (model == null || model.isBlank() || model.equals("gpt-4o-mini")) {
                selectedModel = "openai/gpt-oss-120b";
            }
        }

        Map<String, Object> body = Map.of(
                "model", selectedModel,
                "messages", List.of(
                        Map.of("role", "system", "content", systemPrompt),
                        Map.of("role", "user", "content", (contextTopic != null ? "[Topic: " + contextTopic + "] " : "") + question)
                ),
                "max_tokens", 800
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<Map> resp = restTemplate.postForEntity(targetUrl, entity, Map.class);
        if (resp.getStatusCode().is2xxSuccessful() && resp.getBody() != null) {
            List<Map<String, Object>> choices = (List<Map<String, Object>>) resp.getBody().get("choices");
            if (choices != null && !choices.isEmpty()) {
                Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                return (String) message.get("content");
            }
        }
        throw new RuntimeException("Empty response from OpenAI-compatible API");
    }

    private String generateTutorResponse(String q, String topic) {
        String query = q.toLowerCase();

        if (query.contains("binary search")) {
            return "💡 Pip's Binary Search Guide:\n"
                    + "Binary search works on sorted arrays with O(log N) time.\n"
                    + "Key formula: `mid = left + (right - left) / 2` (prevents integer overflow).\n\n"
                    + "```python\n"
                    + "def binary_search(arr, target):\n"
                    + "    left, right = 0, len(arr) - 1\n"
                    + "    while left <= right:\n"
                    + "        mid = left + (right - left) // 2\n"
                    + "        if arr[mid] == target:\n"
                    + "            return mid\n"
                    + "        elif arr[mid] < target:\n"
                    + "            left = mid + 1\n"
                    + "        else:\n"
                    + "            right = mid - 1\n"
                    + "    return -1\n"
                    + "```";
        }

        if (query.contains("two sum")) {
            return "💡 Pip's Two Sum Solution:\n"
                    + "Use a Hash Map to store `{value: index}` for O(N) time instead of O(N^2) brute force!\n\n"
                    + "```java\n"
                    + "public int[] twoSum(int[] nums, int target) {\n"
                    + "    Map<Integer, Integer> map = new HashMap<>();\n"
                    + "    for (int i = 0; i < nums.length; i++) {\n"
                    + "        int complement = target - nums[i];\n"
                    + "        if (map.containsKey(complement)) {\n"
                    + "            return new int[] { map.get(complement), i };\n"
                    + "        }\n"
                    + "        map.put(nums[i], i);\n"
                    + "    }\n"
                    + "    return new int[] {};\n"
                    + "}\n"
                    + "```";
        }

        if (query.contains("percentage") || (topic != null && topic.toLowerCase().contains("percentage"))) {
            return "💡 Pip's Percentage Tip:\n"
                    + "• Universal formula: (Part / Whole) × 100\n"
                    + "• Multiplier shortcuts: A 25% increase means multiply by 1.25. A 20% decrease means multiply by 0.80.\n"
                    + "• Successive changes: Net % change = a + b + (a × b) / 100.";
        }

        if (query.contains("time and work") || (topic != null && topic.toLowerCase().contains("work"))) {
            return "💡 Pip's Time & Work Strategy:\n"
                    + "1. Convert days into '1-day work units': If A takes 10 days, A does 1/10 work/day.\n"
                    + "2. Shortcut (LCM Method): Take Total Work = LCM(days). Then calculate daily efficiency as integers!";
        }

        if (query.contains("speed") || query.contains("distance") || query.contains("train")) {
            return "💡 Pip's Speed & Distance Tip:\n"
                    + "• Distance = Speed × Time\n"
                    + "• Convert km/h to m/s: multiply by 5/18 (e.g. 72 km/h = 72 × 5/18 = 20 m/s).\n"
                    + "• Average Speed for equal distances: (2 × S1 × S2) / (S1 + S2).";
        }

        if (query.contains("profit") || query.contains("loss")) {
            return "💡 Pip's Profit & Loss Tip:\n"
                    + "• Profit % = (Profit / Cost Price) × 100\n"
                    + "• Selling Price = CP × (100 + Profit%) / 100\n"
                    + "• Marked Price & Discount: Selling Price = MP × (100 - Discount%) / 100.";
        }

        if (query.contains("code") || query.contains("error") || query.contains("java") || query.contains("python") || query.contains("c")) {
            return "🤖 Bloop's Code Mentor:\n"
                    + "To write clean and bug-free code for placement interviews:\n"
                    + "1. **Check Constraints**: If N <= 10^5, aim for O(N) or O(N log N). If N <= 20, recursion/backtracking is fine.\n"
                    + "2. **Edge Cases**: Empty input, single element, negative numbers, all identical values.\n"
                    + "3. Add an `AI_API_KEY` (Gemini or OpenAI) in `preppath-backend/.env` for real-time dynamic code generation!";
        }

        return "🦉 Pip & Bloop here! Placement preparation tip:\n"
                + "1. First identify the category (Aptitude, Reasoning, Verbal, or Coding).\n"
                + "2. Break down the problem into known formulas or base patterns.\n"
                + "3. Add your free Gemini or OpenAI key in `preppath-backend/.env` to unlock live generative responses!";
    }
}
