package com.preppath.badge;

import com.preppath.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * BadgeController — serves badge data for the Profile page.
 *
 * GET /api/badges/me — returns all badges + which ones this user has earned
 */
@RestController
@RequestMapping("/api/badges")
public class BadgeController {

    @Autowired private BadgeRepository badgeRepository;
    @Autowired private StudentBadgeRepository studentBadgeRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getMyBadges(Authentication auth) {
        User user = (User) auth.getPrincipal();

        // Get all badge definitions
        List<Badge> allBadges = badgeRepository.findAll();

        // Get which badges this user has earned
        List<StudentBadge> earned = studentBadgeRepository.findByUserId(user.getId());
        Set<Long> earnedBadgeIds = new HashSet<>();
        Map<Long, String> earnedAtMap = new HashMap<>();
        earned.forEach(sb -> {
            earnedBadgeIds.add(sb.getBadgeId());
            earnedAtMap.put(sb.getBadgeId(), sb.getEarnedAt().toString());
        });

        // Build response
        List<Map<String, Object>> allBadgeDtos = allBadges.stream().map(b -> {
            Map<String, Object> dto = new LinkedHashMap<>();
            dto.put("id", b.getId());
            dto.put("name", b.getName());
            dto.put("description", b.getDescription());
            dto.put("criteriaKey", b.getCriteriaKey());
            dto.put("iconName", b.getIconName());
            return dto;
        }).toList();

        List<Map<String, Object>> earnedDtos = earned.stream().map(sb -> {
            Map<String, Object> dto = new LinkedHashMap<>();
            dto.put("badgeId", sb.getBadgeId());
            dto.put("earnedAt", sb.getEarnedAt().toString());
            return dto;
        }).toList();

        return ResponseEntity.ok(Map.of("allBadges", allBadgeDtos, "earnedBadges", earnedDtos));
    }
}
