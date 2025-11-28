package com.advice.suite.dto;

import java.util.List;

public class PortfolioRequest {
    private String name;
    private String description;
    private String tradeAccount;
    private String betaId;
    private List<Long> selectedUserStockIds;
    
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

	public List<Long> getSelectedUserStockIds() {
		return selectedUserStockIds;
	}
	public void setSelectedUserStockIds(List<Long> selectedUserStockIds) {
		this.selectedUserStockIds = selectedUserStockIds;
	}
	
    
}
