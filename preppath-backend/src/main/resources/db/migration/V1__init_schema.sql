-- ===============================================================
-- PrepPath Initial Database Schema (Flyway V1 Migration)
-- Compatible with Neon PostgreSQL (and H2 PostgreSQL mode)
-- ===============================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'STUDENT',
    xp INT NOT NULL DEFAULT 0,
    streak_count INT NOT NULL DEFAULT 0,
    last_active_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories Table (QLR or CODING)
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL -- 'QLR' or 'CODING'
);

-- 3. Topics Table
CREATE TABLE IF NOT EXISTS topics (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    learning_content TEXT,
    sequence_order INT NOT NULL DEFAULT 1
);

-- 4. Levels Table (EASY, MEDIUM, HARD, CHALLENGE)
CREATE TABLE IF NOT EXISTS levels (
    id BIGSERIAL PRIMARY KEY,
    topic_id BIGINT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL -- 'EASY', 'MEDIUM', 'HARD', 'CHALLENGE'
);

-- 5. Questions Table (MCQs)
CREATE TABLE IF NOT EXISTS questions (
    id BIGSERIAL PRIMARY KEY,
    topic_id BIGINT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    difficulty VARCHAR(20) NOT NULL, -- 'EASY', 'MEDIUM', 'HARD', 'CHALLENGE'
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option VARCHAR(5) NOT NULL, -- 'A', 'B', 'C', 'D'
    explanation TEXT
);

-- 6. Quiz Attempts Table
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id BIGINT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    level_type VARCHAR(20) NOT NULL, -- 'EASY', 'MEDIUM', 'HARD', 'CHALLENGE'
    score INT NOT NULL,
    total_questions INT NOT NULL,
    accuracy DOUBLE PRECISION NOT NULL,
    time_taken INT NOT NULL, -- in seconds
    passed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. Quiz Attempt Answers Table
CREATE TABLE IF NOT EXISTS quiz_attempt_answers (
    id BIGSERIAL PRIMARY KEY,
    attempt_id BIGINT NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    selected_option VARCHAR(5),
    is_correct BOOLEAN NOT NULL
);

-- 8. Coding Problems Table
CREATE TABLE IF NOT EXISTS coding_problems (
    id BIGSERIAL PRIMARY KEY,
    topic_id BIGINT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    statement TEXT NOT NULL,
    constraints TEXT,
    difficulty VARCHAR(20) NOT NULL DEFAULT 'EASY',
    sample_input TEXT,
    sample_output TEXT,
    starter_code_c TEXT,
    starter_code_java TEXT,
    starter_code_python TEXT,
    hints TEXT
);

-- 9. Coding Test Cases Table
CREATE TABLE IF NOT EXISTS coding_test_cases (
    id BIGSERIAL PRIMARY KEY,
    problem_id BIGINT NOT NULL REFERENCES coding_problems(id) ON DELETE CASCADE,
    input TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    is_hidden BOOLEAN NOT NULL DEFAULT FALSE
);

-- 10. Coding Submissions Table
CREATE TABLE IF NOT EXISTS coding_submissions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    problem_id BIGINT NOT NULL REFERENCES coding_problems(id) ON DELETE CASCADE,
    language VARCHAR(20) NOT NULL,
    code TEXT NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'ACCEPTED', 'WRONG_ANSWER', 'COMPILATION_ERROR', etc.
    runtime DOUBLE PRECISION,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 11. Student Progress Table (Enforces 70% unlock rule on backend)
CREATE TABLE IF NOT EXISTS student_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id BIGINT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    easy_best DOUBLE PRECISION DEFAULT 0.0,
    medium_best DOUBLE PRECISION DEFAULT 0.0,
    hard_best DOUBLE PRECISION DEFAULT 0.0,
    challenge_best DOUBLE PRECISION DEFAULT 0.0,
    status VARCHAR(30) NOT NULL DEFAULT 'LOCKED', -- 'LOCKED', 'UNLOCKED', 'COMPLETED'
    CONSTRAINT uq_user_topic UNIQUE (user_id, topic_id)
);

-- 12. Badges Table
CREATE TABLE IF NOT EXISTS badges (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    criteria_key VARCHAR(50) NOT NULL UNIQUE,
    icon_name VARCHAR(50) NOT NULL
);

-- 13. Student Badges Table
CREATE TABLE IF NOT EXISTS student_badges (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id BIGINT NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_badge UNIQUE (user_id, badge_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_user ON student_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_coding_submissions_user ON coding_submissions(user_id);
