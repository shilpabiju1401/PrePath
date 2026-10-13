package com.preppath.quiz;

import jakarta.persistence.*;

/**
 * QuizAttemptAnswer — stores each answer the student submitted during a quiz.
 * Used for analytics and to verify results server-side.
 */
@Entity
@Table(name = "quiz_attempt_answers")
public class QuizAttemptAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "attempt_id", nullable = false)
    private Long attemptId;

    @Column(name = "question_id", nullable = false)
    private Long questionId;

    @Column(name = "selected_option", length = 5)
    private String selectedOption; // "A", "B", "C", or "D" (null if timed out)

    @Column(name = "is_correct", nullable = false)
    private Boolean isCorrect = false;

    // ── Getters and Setters ──
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getAttemptId() { return attemptId; }
    public void setAttemptId(Long attemptId) { this.attemptId = attemptId; }

    public Long getQuestionId() { return questionId; }
    public void setQuestionId(Long questionId) { this.questionId = questionId; }

    public String getSelectedOption() { return selectedOption; }
    public void setSelectedOption(String selectedOption) { this.selectedOption = selectedOption; }

    public Boolean getIsCorrect() { return isCorrect; }
    public void setIsCorrect(Boolean isCorrect) { this.isCorrect = isCorrect; }
}
