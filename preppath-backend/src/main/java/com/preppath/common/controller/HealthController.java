package com.preppath.common.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @Autowired(required = false)
    private DataSource dataSource;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "PrepPath Backend API");
        response.put("version", "1.0.0");
        response.put("timestamp", Instant.now().toString());

        // Check Database status
        if (dataSource != null) {
            try (Connection connection = dataSource.getConnection()) {
                DatabaseMetaData metaData = connection.getMetaData();
                Map<String, String> dbInfo = new HashMap<>();
                dbInfo.put("status", "CONNECTED");
                dbInfo.put("productName", metaData.getDatabaseProductName());
                dbInfo.put("productVersion", metaData.getDatabaseProductVersion());
                response.put("database", dbInfo);
            } catch (Exception e) {
                Map<String, String> dbInfo = new HashMap<>();
                dbInfo.put("status", "DISCONNECTED");
                dbInfo.put("error", e.getMessage());
                response.put("database", dbInfo);
            }
        } else {
            response.put("database", "NOT_CONFIGURED");
        }

        return ResponseEntity.ok(response);
    }
}
