package com.advice.suite.repository;

import com.advice.suite.entity.TradeAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TradeAccountRepository extends JpaRepository<TradeAccount, Long> {

    List<TradeAccount> findAllByBetaId(String betaId);
    Optional<TradeAccount> findByUserIdAndAccountNumber(Long userId, String accountNumber);
    Optional<TradeAccount> findByAccountNumber(String accountNumber);
    Optional<TradeAccount> findByAccountNumberAndBetaId(String accountNumber, String betaId);
}
