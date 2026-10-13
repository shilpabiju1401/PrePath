-- V8: Track which topics a user has completed via the "Next" button
CREATE TABLE IF NOT EXISTS topic_completions (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id   BIGINT    NOT NULL REFERENCES coding_topics(id) ON DELETE CASCADE,
    completed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_topic_completion UNIQUE (user_id, topic_id)
);
