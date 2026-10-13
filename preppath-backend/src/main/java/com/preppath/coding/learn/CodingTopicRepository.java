package com.preppath.coding.learn;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CodingTopicRepository extends JpaRepository<CodingTopic, Long> {
    List<CodingTopic> findByLevelNumberOrderBySequenceOrderAsc(Integer levelNumber);
    List<CodingTopic> findAllByOrderByLevelNumberAscSequenceOrderAsc();
}
