package com.advice.suite.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.advice.suite.entity.Stock;

public interface StockRepository extends JpaRepository<Stock, Long> {
    boolean existsByCompanyName(String companyName);
    Optional<Stock> findByCompanyName(String companyName);
    List<Stock> findByIdIn(List<Long> ids);
}
