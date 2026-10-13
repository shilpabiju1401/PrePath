package com.preppath.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    // Spring Data JPA generates: SELECT * FROM users ORDER BY xp DESC LIMIT 50
    List<User> findTop50ByOrderByXpDesc();
}
