package com.advice.suite.controller;
 
import com.advice.suite.entity.UserStockTransaction;
import com.advice.suite.service.UserStockTransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
 
import java.util.List;
 
@RestController
@RequestMapping("/api/user-stock-transactions")
@CrossOrigin(origins = "http://localhost:3000")
public class UserStockTransactionController {
 
    @Autowired
    private UserStockTransactionService transactionService;
 
    @GetMapping("/{betaId}/transactions")
    public List<UserStockTransaction> getTransactionHistory(@PathVariable("betaId") String betaId) {
        return transactionService.getTransactionsByBetaId(betaId);
    }
}