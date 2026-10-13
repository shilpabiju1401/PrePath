package com.preppath.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * UserController — provides the current logged-in user's profile.
 *
 * GET /api/users/me → returns the user's public profile data.
 *
 * The Authentication object is automatically injected by Spring Security
 * from the JWT filter — it contains the logged-in User entity.
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    /**
     * Returns the profile of the currently logged-in user.
     * We return a Map (DTO) instead of the User entity to:
     *  1. Never expose passwordHash to the frontend.
     *  2. Control exactly what data is sent.
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication auth) {
        User principal = (User) auth.getPrincipal(); // Set by JwtAuthFilter
        // Reload from database to ensure fresh XP and streak count
        User user = userRepository.findById(principal.getId()).orElse(principal);

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole(),
                "xp", user.getXp(),
                "streakCount", user.getStreakCount(),
                "lastActiveDate", user.getLastActiveDate() != null ? user.getLastActiveDate().toString() : ""
        ));
    }
}
