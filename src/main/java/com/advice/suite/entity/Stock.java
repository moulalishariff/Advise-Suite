package com.advice.suite.entity;

import java.math.BigDecimal;

import com.advice.suite.enums.StockType;

import jakarta.persistence.*;

@Entity
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String companyName;

    @Column(nullable = false)
    private Integer totalStocks;

    @Column(nullable = false)
    private Integer availableStocks;

    @Column(nullable = false)
    private BigDecimal currentPrice;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StockType stockType;
    
    public Stock() {
    }

    public Stock(Long id, String companyName, Integer totalStocks, Integer availableStocks, BigDecimal currentPrice, StockType stockType) {
        this.id = id;
        this.companyName = companyName;
        this.totalStocks = totalStocks;
        this.availableStocks = availableStocks;
        this.currentPrice = currentPrice;
        this.stockType = stockType;
    }
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	public void setCurrentPrice(BigDecimal currentPrice) {
		this.currentPrice = currentPrice;
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public Integer getTotalStocks() {
		return totalStocks;
	}

	public void setTotalStocks(Integer totalStocks) {
		this.totalStocks = totalStocks;
	}

	public Integer getAvailableStocks() {
		return availableStocks;
	}

	public void setAvailableStocks(Integer availableStocks) {
		this.availableStocks = availableStocks;
	}

	public StockType getStockType() {
		return stockType;
	}

	public BigDecimal getCurrentPrice() {
		return currentPrice;
	}

	public void setStockType(StockType stockType) {
		this.stockType = stockType;
	}
    
}
