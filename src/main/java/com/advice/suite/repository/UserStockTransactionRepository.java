package com.advice.suite.repository;
 
import com.advice.suite.entity.UserStockTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
 
import java.util.List;
 
public interface UserStockTransactionRepository extends JpaRepository<UserStockTransaction, Long> {
    List<UserStockTransaction> findByBetaIdOrderByTransactedAtDesc(String betaId);
}