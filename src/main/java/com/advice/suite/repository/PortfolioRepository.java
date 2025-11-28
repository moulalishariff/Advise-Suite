package com.advice.suite.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.advice.suite.entity.Portfolio;

public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    List<Portfolio> findByBetaId(String betaId);
    List<Portfolio> findBySelectedUserStocks_Id(Long userStockId);

}
