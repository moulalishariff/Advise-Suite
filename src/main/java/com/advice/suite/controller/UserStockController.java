package com.advice.suite.controller;

import com.advice.suite.dto.UserStockDto;
import com.advice.suite.service.UserStockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-stocks")
public class UserStockController {

    @Autowired
    private UserStockService userStockService;

    @GetMapping("/{betaId}")
    public ResponseEntity<List<UserStockDto>> getUserStocks(@PathVariable("betaId") String betaId) {
        List<UserStockDto> stocks = userStockService.getUserStocks(betaId);
        return ResponseEntity.ok(stocks);
    }

    @PostMapping("/{betaId}/buy")
    public ResponseEntity<UserStockDto> buyStock(
            @PathVariable("betaId") String betaId,
            @RequestParam("stockName") String stockName,
            @RequestParam("quantity") int quantity,
            @RequestParam("accountNumber") String accountNumber) {

        UserStockDto result = userStockService.buyStock(betaId, stockName, quantity, accountNumber);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{betaId}/sell")
    public ResponseEntity<UserStockDto> sellStock(
            @PathVariable("betaId") String betaId,
            @RequestParam("stockName") String stockName,
            @RequestParam("quantity") int quantity,
            @RequestParam("accountNumber") String accountNumber) {

        UserStockDto result = userStockService.sellStock(betaId, stockName, quantity, accountNumber);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUserStock(@PathVariable("id") Long id) {
        userStockService.deleteStock(id);
        return ResponseEntity.ok("User stock deleted successfully");
    }
}
