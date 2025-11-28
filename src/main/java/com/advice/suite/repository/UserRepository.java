package com.advice.suite.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.advice.suite.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findByBetaId(String betaId);
    Optional<User> getUserByBetaId(String betaId);
	Optional<User> findByEmailAndBetaIdAndPhone(String email, String betaId, String phone);

}
