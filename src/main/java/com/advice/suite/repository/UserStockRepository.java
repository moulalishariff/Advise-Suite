package com.advice.suite.repository;

import com.advice.suite.entity.User;
import com.advice.suite.entity.UserStock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserStockRepository extends JpaRepository<UserStock, Long> {
    List<UserStock> findByBetaId(String betaId);
    List<UserStock> findByBetaIdAndStockName(String betaId, String stockName);
    List<UserStock> findByStockName(String stockName);

}
