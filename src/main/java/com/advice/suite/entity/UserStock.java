package com.advice.suite.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_stocks")
public class UserStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "beta_id", referencedColumnName = "betaId", insertable = false, updatable = false)
    private User user;

    @Column(name = "beta_id", nullable = false)
    private String betaId;
    private BigDecimal purchaseValue;
    private BigDecimal currentValue;
    private String stockName;

    private Integer quantity;
    @Column(nullable = false)
    private BigDecimal purchasePricePerUnit;  // New field instead of purchaseValue

    private BigDecimal potentialGainLoss;

    private LocalDateTime boughtAt;
    
	public BigDecimal getPurchasePricePerUnit() {
		return purchasePricePerUnit;
	}

	public void setPurchasePricePerUnit(BigDecimal purchasePricePerUnit) {
		this.purchasePricePerUnit = purchasePricePerUnit;
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
	
	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
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

	public BigDecimal getCurrentValue() {
		return currentValue;
	}

	public void setCurrentValue(BigDecimal currentValue) {
		this.currentValue = currentValue;
	}
    
}
