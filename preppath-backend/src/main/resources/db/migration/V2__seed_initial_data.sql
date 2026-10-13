-- ===============================================================
-- PrepPath Seed Data (Flyway V2 Migration)
-- Seeds initial categories and badges
-- ===============================================================

-- 1. Insert Categories
INSERT INTO categories (id, name, type) VALUES
(1, 'Quantitative Aptitude', 'QLR'),
(2, 'Logical Reasoning', 'QLR'),
(3, 'Verbal Ability', 'QLR'),
(4, 'Programming & DSA', 'CODING');

-- 2. Insert Gamification Badges
INSERT INTO badges (id, name, description, criteria_key, icon_name) VALUES
(1, 'First Steps', 'Completed your very first topic quiz with a passing score!', 'FIRST_QUIZ_PASS', 'badge_first_step'),
(2, 'Quiz Master', 'Scored 100% on any Hard level or Topic Challenge', 'PERFECT_HARD_SCORE', 'badge_quiz_master'),
(3, 'Coding Explorer', 'Successfully ran and submitted your first coding problem', 'FIRST_CODE_ACCEPTED', 'badge_code_explorer'),
(4, 'Seven-Day Streak', 'Maintained a dedicated study streak for 7 consecutive days', 'STREAK_7_DAYS', 'badge_streak_seven'),
(5, 'DSA Champion', 'Solved 10 DSA coding problems across Arrays and Strings', 'SOLVED_10_DSA', 'badge_dsa_champion');
