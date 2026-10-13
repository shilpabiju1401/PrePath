package com.preppath.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JwtUtil — generates and validates JSON Web Tokens.
 *
 * How JWTs work:
 *  1. On login, we create a token signed with our secret key.
 *  2. The token is sent to the browser.
 *  3. On every request, the browser sends the token back.
 *  4. We verify the signature to confirm it's authentic.
 */
@Component
public class JwtUtil {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms}")
    private long jwtExpirationMs;

    // Convert the secret string into a cryptographic key
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Create a JWT token for the given user email.
     * The token contains the email (subject) and an expiry time.
     */
    public String generateToken(String email) {
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Extract the email from a JWT token.
     * Returns null if the token is invalid or expired.
     */
    public String extractEmail(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return claims.getSubject();
        } catch (Exception e) {
            return null; // Invalid token
        }
    }

    /**
     * Check if a token is valid (not expired and properly signed).
     */
    public boolean isTokenValid(String token) {
        return extractEmail(token) != null;
    }
}
