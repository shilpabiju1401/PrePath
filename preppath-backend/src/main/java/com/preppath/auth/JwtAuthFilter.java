package com.preppath.auth;

import com.preppath.user.User;
import com.preppath.user.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * JwtAuthFilter — runs on EVERY incoming HTTP request (once per request).
 *
 * It reads the "Authorization: Bearer <token>" header, validates the JWT,
 * and loads the user into Spring Security's context so that @PreAuthorize
 * and role-based access control work on every endpoint.
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // Read the Authorization header
        String authHeader = request.getHeader("Authorization");

        // If no Bearer token is present, skip this filter (public endpoints will still work)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Strip the "Bearer " prefix
        String token = authHeader.substring(7);

        // Validate the token and extract the email
        String email = jwtUtil.extractEmail(token);

        // If valid and no existing authentication, set the user in security context
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            User user = userRepository.findByEmail(email).orElse(null);

            if (user != null) {
                // Create a Spring Security authentication object with the user's role
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        user,
                        null,
                        List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Store in security context — subsequent security checks will read from here
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // Continue processing the request
        filterChain.doFilter(request, response);
    }
}
