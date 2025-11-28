package com.advice.suite.service;

import com.advice.suite.dto.TradeAccountDto;
import com.advice.suite.entity.TradeAccount;
import com.advice.suite.enums.TaxStatus;
import com.advice.suite.repository.TradeAccountRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class TradeAccountService {

    private final TradeAccountRepository accountRepo;

    public TradeAccountService(TradeAccountRepository accountRepo) {
        this.accountRepo = accountRepo;
    }

    public TradeAccount createAccount(String betaId, TradeAccountDto dto) {
        TradeAccount account = new TradeAccount();
        account.setAccountName(dto.getAccountName());
        account.setAccountType(dto.getAccountType());
        account.setBalance(BigDecimal.ZERO);
        account.setTaxStatus(TaxStatus.TAX_FREE); 
        account.setBetaId(betaId);

        return accountRepo.save(account);
    }

    public TradeAccount updateAccount(String betaId, String accountNumber, TradeAccountDto dto) {
        // Find account by betaId and account number
        TradeAccount account = accountRepo.findByAccountNumberAndBetaId(accountNumber, betaId)
                .orElseThrow(() -> new RuntimeException("Account not found or unauthorized"));

        // Update account details
        account.setAccountName(dto.getAccountName());
        account.setAccountType(dto.getAccountType());

        return accountRepo.save(account);
    }

    public void deleteAccount(String betaId, String accountNumber) {
        // Find account by betaId and account number to ensure correct deletion
        TradeAccount account = accountRepo.findByAccountNumberAndBetaId(accountNumber, betaId)
                .orElseThrow(() -> new RuntimeException("Account not found or unauthorized"));

        // Delete the account
        accountRepo.delete(account);
    }

    public List<TradeAccount> getAccountsForUser(String betaId) {
        return accountRepo.findAllByBetaId(betaId);  // Fetch all accounts by betaId
    }

    public TradeAccount deposit(String betaId, String accountNumber, double amount) {
        // Find the account by betaId and account number
        TradeAccount account = accountRepo.findByAccountNumberAndBetaId(accountNumber, betaId)
                .orElseThrow(() -> new RuntimeException("Account not found or unauthorized"));

        // Update the account balance
        account.setBalance(account.getBalance().add(BigDecimal.valueOf(amount)));

        // Auto-update tax status based on balance
        if (account.getBalance().compareTo(BigDecimal.valueOf(10000)) >= 0) {
            account.setTaxStatus(TaxStatus.TAXABLE);
        } else {
            account.setTaxStatus(TaxStatus.TAX_FREE);
        }	

        return accountRepo.save(account);  // Save the updated account
    }
    public TradeAccount withdraw(String betaId, String accountNumber, double amount) {
        // Find the account by betaId and account number
        TradeAccount account = accountRepo.findByAccountNumberAndBetaId(accountNumber, betaId)
                .orElseThrow(() -> new RuntimeException("Account not found or unauthorized"));

        // Check if the balance is sufficient
        if (account.getBalance().compareTo(BigDecimal.valueOf(amount)) < 0) {
            throw new RuntimeException("Insufficient balance for withdrawal");
        }

        // Update the account balance
        account.setBalance(account.getBalance().subtract(BigDecimal.valueOf(amount)));

        // Auto-update tax status based on balance
        if (account.getBalance().compareTo(BigDecimal.valueOf(10000)) >= 0) {
            account.setTaxStatus(TaxStatus.TAXABLE);
        } else {
            account.setTaxStatus(TaxStatus.TAX_FREE);
        }

        return accountRepo.save(account);  // Save the updated account
    }


}
