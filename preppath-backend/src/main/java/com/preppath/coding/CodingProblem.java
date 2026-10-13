package com.preppath.coding;

import jakarta.persistence.*;

/**
 * CodingProblem entity — programming problem stored in 'coding_problems'.
 */
@Entity
@Table(name = "coding_problems")
public class CodingProblem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "topic_id", nullable = false)
    private Long topicId;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String statement;

    @Column(columnDefinition = "TEXT")
    private String constraints;

    @Column(nullable = false, length = 20)
    private String difficulty = "EASY";

    @Column(name = "sample_input", columnDefinition = "TEXT")
    private String sampleInput;

    @Column(name = "sample_output", columnDefinition = "TEXT")
    private String sampleOutput;

    @Column(name = "starter_code_c", columnDefinition = "TEXT")
    private String starterCodeC;

    @Column(name = "starter_code_java", columnDefinition = "TEXT")
    private String starterCodeJava;

    @Column(name = "starter_code_python", columnDefinition = "TEXT")
    private String starterCodePython;

    @Column(columnDefinition = "TEXT")
    private String hints;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getTopicId() { return topicId; }
    public void setTopicId(Long topicId) { this.topicId = topicId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getStatement() { return statement; }
    public void setStatement(String statement) { this.statement = statement; }

    public String getConstraints() { return constraints; }
    public void setConstraints(String constraints) { this.constraints = constraints; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getSampleInput() { return sampleInput; }
    public void setSampleInput(String sampleInput) { this.sampleInput = sampleInput; }

    public String getSampleOutput() { return sampleOutput; }
    public void setSampleOutput(String sampleOutput) { this.sampleOutput = sampleOutput; }

    public String getStarterCodeC() { return starterCodeC; }
    public void setStarterCodeC(String starterCodeC) { this.starterCodeC = starterCodeC; }

    public String getStarterCodeJava() { return starterCodeJava; }
    public void setStarterCodeJava(String starterCodeJava) { this.starterCodeJava = starterCodeJava; }

    public String getStarterCodePython() { return starterCodePython; }
    public void setStarterCodePython(String starterCodePython) { this.starterCodePython = starterCodePython; }

    public String getHints() { return hints; }
    public void setHints(String hints) { this.hints = hints; }
}
