package com.advice.suite.dto;

import java.math.BigDecimal;

import com.advice.suite.enums.StockType;

public class StockDto {
    private Long id;
    private String companyName;
    private Integer totalStocks;
    private Integer availableStocks;
    private BigDecimal currentPrice;
    private StockType stockType;
    
    public StockDto() {
    }

    public StockDto(Long id, String companyName, Integer totalStocks, Integer availableStocks, BigDecimal currentPrice, StockType stockType) {
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
	
	public BigDecimal getCurrentPrice() {
		return currentPrice;
	}

	public void setCurrentPrice(BigDecimal currentPrice) {
		this.currentPrice = currentPrice;
	}

	public StockType getStockType() {
		return stockType;
	}
	public void setStockType(StockType stockType) {
		this.stockType = stockType;
	}
    
}
