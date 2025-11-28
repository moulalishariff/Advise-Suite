package com.advice.suite.entity;
 
import jakarta.persistence.*;
import lombok.*;
 
import java.math.BigDecimal;
import java.time.LocalDateTime;
 
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_stock_transactions")
public class UserStockTransaction {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    private String betaId;
    private String stockName;
    private int quantity;
    private BigDecimal value;
    private String action; // "buy" or "sell"
 
    private LocalDateTime transactedAt;
 
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
 
	public int getQuantity() {
		return quantity;
	}
 
	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}
 
	public BigDecimal getValue() {
		return value;
	}
 
	public void setValue(BigDecimal value) {
		this.value = value;
	}
 
	public String getAction() {
		return action;
	}
 
	public void setAction(String action) {
		this.action = action;
	}
 
	public LocalDateTime getTransactedAt() {
		return transactedAt;
	}
 
	public void setTransactedAt(LocalDateTime transactedAt) {
		this.transactedAt = transactedAt;
	}
}