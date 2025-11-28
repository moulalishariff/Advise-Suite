package com.advice.suite.dto;

import com.advice.suite.entity.UserStock;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class UserStockDto {
    private Long id;
    private String betaId;
    private String stockName;
    private Integer quantity;
    private BigDecimal purchasePricePerUnit;
    private BigDecimal currentValue; // ✅ Keep this
    private BigDecimal potentialGainLoss;
    private BigDecimal purchaseValue;
    private LocalDateTime boughtAt;

    public static UserStockDto fromEntity(UserStock userStock) {
        UserStockDto dto = new UserStockDto();
        dto.setId(userStock.getId());
        dto.setBetaId(userStock.getBetaId());
        dto.setStockName(userStock.getStockName());
        dto.setQuantity(userStock.getQuantity());
        dto.setPurchasePricePerUnit(userStock.getPurchasePricePerUnit());
        dto.setPurchaseValue(userStock.getPurchaseValue());
        dto.setCurrentValue(userStock.getCurrentValue());
        dto.setBoughtAt(userStock.getBoughtAt());
        // Do NOT set currentValue or potentialGainLoss here — handled dynamically later
        return dto;
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getBetaId() {
		return betaId;
	}

	public void setBetaId(String betaId) {
		this.betaId = betaId;
	}

	public String getStockName() {
		return stockName;
	}

	public void setStockName(String stockName) {
		this.stockName = stockName;
	}

	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}

	public BigDecimal getPurchasePricePerUnit() {
		return purchasePricePerUnit;
	}

	public void setPurchasePricePerUnit(BigDecimal purchasePricePerUnit) {
		this.purchasePricePerUnit = purchasePricePerUnit;
	}

	public BigDecimal getCurrentValue() {
		return currentValue;
	}

	public void setCurrentValue(BigDecimal currentValue) {
		this.currentValue = currentValue;
	}

	public BigDecimal getPotentialGainLoss() {
		return potentialGainLoss;
	}

	public void setPotentialGainLoss(BigDecimal potentialGainLoss) {
		this.potentialGainLoss = potentialGainLoss;
	}

	public LocalDateTime getBoughtAt() {
		return boughtAt;
	}

	public void setBoughtAt(LocalDateTime boughtAt) {
		this.boughtAt = boughtAt;
	}

	public BigDecimal getPurchaseValue() {
		return purchaseValue;
	}

	public void setPurchaseValue(BigDecimal purchaseValue) {
		this.purchaseValue = purchaseValue;
	}
    
}
