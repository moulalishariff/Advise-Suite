package com.advice.suite.controller;

import com.advice.suite.dto.TradeAccountDto;
import com.advice.suite.entity.TradeAccount;
import com.advice.suite.service.TradeAccountService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trade-accounts")
public class TradeAccountController {

    private final TradeAccountService tradeAccountService;

    public TradeAccountController(TradeAccountService tradeAccountService) {
        this.tradeAccountService = tradeAccountService;
    }

    @PostMapping("/{betaId}")
    public ResponseEntity<TradeAccount> createAccount(@PathVariable("betaId") String betaId,
                                                      @RequestBody TradeAccountDto dto) {
        return ResponseEntity.ok(tradeAccountService.createAccount(betaId, dto));
    }

    @PutMapping("/{betaId}/{accountNumber}")
    public ResponseEntity<TradeAccount> updateAccount(@PathVariable("betaId") String betaId,
                                                      @PathVariable("accountNumber") String accountNumber,
                                                      @RequestBody TradeAccountDto dto) {
        return ResponseEntity.ok(tradeAccountService.updateAccount(betaId, accountNumber, dto));
    }

    @DeleteMapping("/{betaId}/{accountNumber}")
    public ResponseEntity<String> deleteAccount(@PathVariable("betaId") String betaId,
                                                @PathVariable("accountNumber") String accountNumber) {
        tradeAccountService.deleteAccount(betaId, accountNumber);
        return ResponseEntity.ok("Account deleted successfully.");
    }

    @GetMapping("/{betaId}")
    public ResponseEntity<List<TradeAccount>> getAccounts(@PathVariable("betaId") String betaId) {
        return ResponseEntity.ok(tradeAccountService.getAccountsForUser(betaId));
    }

    @PostMapping("/{betaId}/{accountNumber}/deposit")
    public ResponseEntity<TradeAccount> deposit(@PathVariable("betaId") String betaId,
                                                @PathVariable("accountNumber") String accountNumber,
                                                @RequestParam("amount") double amount) {
        return ResponseEntity.ok(tradeAccountService.deposit(betaId, accountNumber, amount));
    }
    
    @PostMapping("/{betaId}/{accountNumber}/withdraw")
    public ResponseEntity<TradeAccount> withdraw(@PathVariable("betaId") String betaId,
                                                  @PathVariable("accountNumber") String accountNumber,
                                                  @RequestParam("amount") double amount) {
        return ResponseEntity.ok(tradeAccountService.withdraw(betaId, accountNumber, amount));
    }
}
