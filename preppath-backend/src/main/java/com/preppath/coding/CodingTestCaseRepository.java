package com.preppath.coding;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CodingTestCaseRepository extends JpaRepository<CodingTestCase, Long> {
    List<CodingTestCase> findByProblemId(Long problemId);
    List<CodingTestCase> findByProblemIdAndIsHiddenFalse(Long problemId);
}
