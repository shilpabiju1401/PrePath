package com.preppath.auth;

import com.preppath.user.User;
import com.preppath.user.UserRepository;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

/**
 * AuthController — handles user registration and login.
 *
 * POST /api/auth/register — creates a new account, returns JWT
 * POST /api/auth/login    — verifies credentials, returns JWT
 *
 * These endpoints are public (no auth required) — defined in SecurityConfig.
 */
@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // ── Request DTOs (Data Transfer Objects) ──
    // These carry the data from the request body. We never expose Entity objects directly.

    record RegisterRequest(
            @NotBlank(message = "Name is required") String name,
            @Email(message = "Valid email required") @NotBlank String email,
            @Size(min = 6, message = "Password must be at least 6 characters") String password
    ) {}

    record LoginRequest(
            @Email @NotBlank String email,
            @NotBlank String password
    ) {}

    /**
     * Register a new student.
     * Checks if email is already taken, hashes the password, creates the user,
     * and returns a JWT token.
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Validated RegisterRequest req) {
        // Check if email is already in use
        if (userRepository.existsByEmail(req.email())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "An account with this email already exists."));
        }

        // Create the new user — NEVER store plain-text passwords!
        User user = new User();
        user.setName(req.name());
        user.setEmail(req.email());
        user.setPasswordHash(passwordEncoder.encode(req.password())); // BCrypt hash
        user.setRole("STUDENT");
        user.setXp(0);
        user.setStreakCount(0);
        user.setLastActiveDate(LocalDate.now());
        userRepository.save(user);

        // Generate a JWT for immediate use
        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("token", token));
    }

    /**
     * Login with email + password.
     * Returns a JWT token on success.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Validated LoginRequest req) {
        // Look up user by email
        User user = userRepository.findByEmail(req.email()).orElse(null);

        // Check if user exists AND password matches (BCrypt comparison)
        if (user == null || !passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password."));
        }

        // Return the token
        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(Map.of("token", token));
    }
}
