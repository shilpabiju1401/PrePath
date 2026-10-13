package com.preppath.coding;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CodingSubmissionRepository extends JpaRepository<CodingSubmission, Long> {
    List<CodingSubmission> findByUserIdAndProblemIdOrderByCreatedAtDesc(Long userId, Long problemId);
    boolean existsByUserIdAndProblemIdAndStatus(Long userId, Long problemId, String status);
}
