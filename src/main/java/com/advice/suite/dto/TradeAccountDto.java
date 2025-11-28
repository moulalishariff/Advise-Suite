package com.advice.suite.dto;

import com.advice.suite.enums.AccountType;

public class TradeAccountDto {

    private String accountName;
    private AccountType accountType;

    // Getters and Setters
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
}
 