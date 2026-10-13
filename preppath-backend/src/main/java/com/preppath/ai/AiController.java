package com.preppath.ai;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * AiController — endpoint for student questions to the AI Buddy.
 *
 * POST /api/ai/ask
 */
@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private AiService aiService;

    record AskRequest(String question, String contextTopic) {}

    @PostMapping("/ask")
    public ResponseEntity<?> ask(@RequestBody AskRequest req) {
        if (req.question() == null || req.question().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Question cannot be empty."));
        }

        String answer = aiService.askAi(req.question(), req.contextTopic());
        return ResponseEntity.ok(Map.of("reply", answer));
    }
}
