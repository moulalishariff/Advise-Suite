package com.advice.suite.dto;

import java.util.List;
import java.util.Map;

public class PdfRequestDTO {
    private String betaId;
    private List<Long> portfolioIds;
    private List<String> chartImages; 
    
	public String getBetaId() {
		return betaId;
	}
	public void setBetaId(String betaId) {
		this.betaId = betaId;
	}
	public List<Long> getPortfolioIds() {
		return portfolioIds;
	}
	public void setPortfolioIds(List<Long> portfolioIds) {
		this.portfolioIds = portfolioIds;
	}
	public List<String> getChartImages() {
		return chartImages;
	}
	public void setChartImages(List<String> chartImages) {
		this.chartImages = chartImages;
	}

}
