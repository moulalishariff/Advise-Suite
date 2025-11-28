package com.advice.suite.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import jakarta.persistence.CascadeType;

@Entity
public class Portfolio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String tradeAccount;
    private String betaId;

    @ManyToMany(cascade = CascadeType.MERGE)
    @JoinTable(
        name = "portfolio_user_stocks",
        joinColumns = @JoinColumn(name = "portfolio_id"),
        inverseJoinColumns = @JoinColumn(name = "user_stock_id")
    )
    private List<UserStock> selectedUserStocks = new ArrayList<>();

	public Long getId() {
		return id;
	}

	public List<UserStock> getSelectedUserStocks() {
		return selectedUserStocks;
	}

	public void setSelectedUserStocks(List<UserStock> selectedUserStocks) {
		this.selectedUserStocks = selectedUserStocks;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getTradeAccount() {
		return tradeAccount;
	}

	public void setTradeAccount(String tradeAccount) {
		this.tradeAccount = tradeAccount;
	}

	public String getBetaId() {
		return betaId;
	}

	public void setBetaId(String betaId) {
		this.betaId = betaId;
	}
    
}
