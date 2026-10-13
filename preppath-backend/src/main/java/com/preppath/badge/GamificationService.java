package com.preppath.badge;

import com.preppath.user.User;
import com.preppath.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * GamificationService — handles:
 *  1. Automatic badge awarding (First Steps, Quiz Master, Streak, etc.)
 *  2. Daily login & study streak maintenance
 */
@Service
public class GamificationService {

    @Autowired
    private BadgeRepository badgeRepository;

    @Autowired
    private StudentBadgeRepository studentBadgeRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Updates student daily streak if needed.
     * Called whenever student logs in or performs an activity (quiz, problem).
     */
    @Transactional
    public int updateStreak(User user) {
        LocalDate today = LocalDate.now();
        LocalDate lastActive = user.getLastActiveDate();

        if (lastActive == null) {
            user.setStreakCount(1);
            user.setLastActiveDate(today);
        } else if (lastActive.equals(today)) {
            // Already active today — maintain current streak
        } else if (lastActive.equals(today.minusDays(1))) {
            // Active consecutive day — increment streak!
            user.setStreakCount(user.getStreakCount() + 1);
            user.setLastActiveDate(today);
        } else {
            // Missed more than 1 day — reset streak to 1
            user.setStreakCount(1);
            user.setLastActiveDate(today);
        }

        userRepository.save(user);

        // Check 7-day streak badge
        if (user.getStreakCount() >= 7) {
            awardBadgeIfEligible(user.getId(), "STREAK_7_DAYS");
        }

        return user.getStreakCount();
    }

    /**
     * Checks and awards badges earned upon completing a quiz.
     * Returns a list of newly unlocked badge DTOs.
     */
    @Transactional
    public List<Map<String, Object>> evaluateQuizBadges(Long userId, boolean passed, double accuracy, String levelType) {
        List<Map<String, Object>> newlyAwarded = new ArrayList<>();

        // 1. "First Steps" — first quiz passed
        if (passed) {
            Badge badge = awardBadgeIfEligible(userId, "FIRST_QUIZ_PASS");
            if (badge != null) {
                newlyAwarded.add(Map.of(
                        "name", badge.getName(),
                        "description", badge.getDescription(),
                        "iconName", badge.getIconName()
                ));
            }
        }

        // 2. "Quiz Master" — 100% score on Hard or Topic Challenge
        if (accuracy >= 100.0 && ("HARD".equalsIgnoreCase(levelType) || "CHALLENGE".equalsIgnoreCase(levelType))) {
            Badge badge = awardBadgeIfEligible(userId, "PERFECT_HARD_SCORE");
            if (badge != null) {
                newlyAwarded.add(Map.of(
                        "name", badge.getName(),
                        "description", badge.getDescription(),
                        "iconName", badge.getIconName()
                ));
            }
        }

        return newlyAwarded;
    }

    /**
     * Awards a badge if the student doesn't already have it.
     * Returns the Badge if newly awarded, or null if already owned.
     */
    @Transactional
    public Badge awardBadgeIfEligible(Long userId, String criteriaKey) {
        Badge badge = badgeRepository.findByCriteriaKey(criteriaKey).orElse(null);
        if (badge == null) return null;

        if (!studentBadgeRepository.existsByUserIdAndBadgeId(userId, badge.getId())) {
            StudentBadge sb = new StudentBadge();
            sb.setUserId(userId);
            sb.setBadgeId(badge.getId());
            studentBadgeRepository.save(sb);
            return badge;
        }

        return null;
    }
}
