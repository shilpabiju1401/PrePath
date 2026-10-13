package com.preppath.coding;

import jakarta.persistence.*;

/**
 * CodingTestCase entity — test case for automated grading.
 */
@Entity
@Table(name = "coding_test_cases")
public class CodingTestCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "problem_id", nullable = false)
    private Long problemId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String input;

    @Column(name = "expected_output", nullable = false, columnDefinition = "TEXT")
    private String expectedOutput;

    @Column(name = "is_hidden", nullable = false)
    private Boolean isHidden = false;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProblemId() { return problemId; }
    public void setProblemId(Long problemId) { this.problemId = problemId; }

    public String getInput() { return input; }
    public void setInput(String input) { this.input = input; }

    public String getExpectedOutput() { return expectedOutput; }
    public void setExpectedOutput(String expectedOutput) { this.expectedOutput = expectedOutput; }

    public Boolean getIsHidden() { return isHidden; }
    public void setIsHidden(Boolean isHidden) { this.isHidden = isHidden; }
}
