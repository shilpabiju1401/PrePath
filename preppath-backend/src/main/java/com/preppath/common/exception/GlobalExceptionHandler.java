package com.preppath.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.stream.Collectors;

/**
 * GlobalExceptionHandler — catches exceptions across ALL controllers
 * and returns consistent, friendly JSON error responses.
 *
 * Without this, Spring Boot returns HTML error pages.
 * With this, the frontend always gets: { "message": "...", "status": 400 }
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles validation errors from @Valid / @Validated annotations.
     * E.g.: missing required fields, email format errors, etc.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(MethodArgumentNotValidException ex) {
        // Collect all field error messages into one string
        String errors = ex.getBindingResult().getFieldErrors().stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .collect(Collectors.joining(", "));

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", errors, "status", 400));
    }

    /**
     * Handles ResponseStatusException (thrown explicitly in controllers/services).
     * E.g.: 403 Forbidden for locked levels, 404 Not Found for missing resources.
     */
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handleResponseStatus(ResponseStatusException ex) {
        return ResponseEntity
                .status(ex.getStatusCode())
                .body(Map.of("message", ex.getReason(), "status", ex.getStatusCode().value()));
    }

    /**
     * Catch-all for unexpected errors.
     * Never exposes internal stack traces to the client.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericError(Exception ex) {
        ex.printStackTrace(); // Log for developers
        String detail = ex.getMessage() != null ? ex.getMessage() : ex.getClass().getSimpleName();
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                        "message", "Server Error: " + detail,
                        "status", 500,
                        "errorType", ex.getClass().getSimpleName()
                ));
    }
}
