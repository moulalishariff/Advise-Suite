package com.advice.suite.entity;

import com.advice.suite.enums.AccountType;
import com.advice.suite.enums.TaxStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.security.SecureRandom;

@Entity
@Table(name = "trade_accounts")
public class TradeAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, length = 12)
    private String accountNumber;

    private String accountName;

    @Enumerated(EnumType.STRING)
    private AccountType accountType;

    @Enumerated(EnumType.STRING)
    private TaxStatus taxStatus;

    private BigDecimal balance;

    // Remove the direct betaId string and use a ManyToOne relationship
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "beta_id", referencedColumnName = "betaId", insertable = false, updatable = false)
    private User user;  // Link to the User entity

    @Column(name = "beta_id", nullable = false)
    private String betaId;  // This column still exists to maintain the betaId in the table

    @PrePersist
    public void generateAccountNumber() {
        if (this.accountNumber == null) {
            this.accountNumber = generate12DigitNumber();
        }
    }

    private String generate12DigitNumber() {
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(12);
        for (int i = 0; i < 12; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public AccountType getAccountType() {
        return accountType;
    }

    public void setAccountType(AccountType accountType) {
        this.accountType = accountType;
    }

    public TaxStatus getTaxStatus() {
        return taxStatus;
    }

    public void setTaxStatus(TaxStatus taxStatus) {
        this.taxStatus = taxStatus;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public String getBetaId() {
        return betaId;
    }

    public void setBetaId(String betaId) {
        this.betaId = betaId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
