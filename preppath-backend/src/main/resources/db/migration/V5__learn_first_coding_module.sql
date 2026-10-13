-- ================================================================
-- PrepPath V5 Migration: Learn-First Coding Module
-- ================================================================

-- 1. Coding Topics (Levels 1 to 4)
CREATE TABLE IF NOT EXISTS coding_topics (
    id BIGSERIAL PRIMARY KEY,
    level_number INT NOT NULL, -- 1: Basics, 2: Core DSA, 3: Intermediate DSA, 4: Advanced DSA
    name VARCHAR(150) NOT NULL,
    sequence_order INT NOT NULL DEFAULT 1,
    summary TEXT NOT NULL
);

-- 2. Topic Sections (What is it?, analogies, concepts, mistakes, summaries)
CREATE TABLE IF NOT EXISTS topic_sections (
    id BIGSERIAL PRIMARY KEY,
    topic_id BIGINT NOT NULL REFERENCES coding_topics(id) ON DELETE CASCADE,
    section_type VARCHAR(50) NOT NULL, -- 'ANALOGY', 'CONCEPT', 'MISTAKES', 'SUMMARY'
    title VARCHAR(200) NOT NULL,
    content_markdown TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 1
);

-- 3. Topic Code Examples (C, Java, Python with line-by-line explanation)
CREATE TABLE IF NOT EXISTS topic_code_examples (
    id BIGSERIAL PRIMARY KEY,
    topic_id BIGINT NOT NULL REFERENCES coding_topics(id) ON DELETE CASCADE,
    language VARCHAR(20) NOT NULL, -- 'c', 'java', 'python'
    title VARCHAR(200) NOT NULL,
    code TEXT NOT NULL,
    explanation TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 1
);

-- 4. Topic Visualizations (Step-by-step interactive SVG animations)
CREATE TABLE IF NOT EXISTS topic_visualizations (
    id BIGSERIAL PRIMARY KEY,
    topic_id BIGINT NOT NULL UNIQUE REFERENCES coding_topics(id) ON DELETE CASCADE,
    viz_type VARCHAR(50) NOT NULL DEFAULT 'DEFAULT', -- 'BOX', 'ARRAY', 'POINTERS', etc.
    steps_json TEXT NOT NULL
);

-- 5. Coding Runs (Free playground run logs)
CREATE TABLE IF NOT EXISTS coding_runs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id BIGINT NOT NULL REFERENCES coding_topics(id) ON DELETE CASCADE,
    language VARCHAR(20) NOT NULL,
    code TEXT NOT NULL,
    stdin TEXT,
    status VARCHAR(50) NOT NULL, -- 'SUCCESS', 'COMPILATION_ERROR', 'RUNTIME_ERROR', etc.
    stdout TEXT,
    stderr TEXT,
    runtime DOUBLE PRECISION,
    xp_awarded INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. Add practiced column to student_progress if not present
ALTER TABLE student_progress ADD COLUMN IF NOT EXISTS practiced BOOLEAN NOT NULL DEFAULT FALSE;
