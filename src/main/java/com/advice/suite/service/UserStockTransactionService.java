package com.advice.suite.service;
 
import com.advice.suite.entity.UserStockTransaction;
import com.advice.suite.repository.UserStockTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
 
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
 
@Service
public class UserStockTransactionService {
 
    @Autowired
    private UserStockTransactionRepository transactionRepository;
 
    public void recordTransaction(String betaId, String stockName, int quantity, BigDecimal value, String action) {
        UserStockTransaction txn = new UserStockTransaction();
        txn.setBetaId(betaId);
        txn.setStockName(stockName);
        txn.setQuantity(quantity);
        txn.setValue(value);
        txn.setAction(action);
        txn.setTransactedAt(LocalDateTime.now());
        transactionRepository.save(txn);
    }
 
    public List<UserStockTransaction> getTransactionsByBetaId(String betaId) {
        return transactionRepository.findByBetaIdOrderByTransactedAtDesc(betaId);
    }
}