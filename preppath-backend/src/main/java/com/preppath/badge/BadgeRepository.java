package com.preppath.badge;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BadgeRepository extends JpaRepository<Badge, Long> {
    java.util.Optional<Badge> findByCriteriaKey(String criteriaKey);
}

