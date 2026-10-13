package com.preppath.leaderboard;

import com.preppath.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * LeaderboardController — returns top users ranked by XP.
 *
 * GET /api/leaderboard?range=weekly|all
 *
 * For now both weekly and all-time return the same data (top 50 by XP).
 * Weekly filtering can be added in Phase 7 using quiz_attempts created_at.
 */
@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getLeaderboard(@RequestParam(defaultValue = "all") String range) {
        // Get top 50 users sorted by XP descending
        // Spring Data JPA: findAllByOrderByXpDesc() generates: SELECT * FROM users ORDER BY xp DESC
        List<Map<String, Object>> result = userRepository.findTop50ByOrderByXpDesc()
                .stream()
                .map(u -> {
                    Map<String, Object> entry = new LinkedHashMap<>();
                    entry.put("id", u.getId());
                    entry.put("name", u.getName());
                    entry.put("email", u.getEmail()); // Used by frontend to highlight "You"
                    entry.put("xp", u.getXp());
                    entry.put("streakCount", u.getStreakCount());
                    return entry;
                })
                .toList();

        return ResponseEntity.ok(result);
    }
}
