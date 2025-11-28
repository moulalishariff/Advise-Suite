package com.advice.suite.entity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import jakarta.persistence.*;

@Entity
public class PdfRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String betaId;
    private String status;
    private LocalDateTime requestedAt;
    private boolean approved = false;
    private boolean processed = false;
    
    @ManyToMany
    private List<Portfolio> portfolios;
    
    @ElementCollection
    @CollectionTable(name = "pdf_request_pie_charts", joinColumns = @JoinColumn(name = "request_id"))
    @MapKeyColumn(name = "portfolio_id")
    @Column(name = "image_base64", columnDefinition = "LONGTEXT")
    private Map<Long, String> pieChartImages;

    @ElementCollection
    @CollectionTable(name = "pdf_request_bar_charts", joinColumns = @JoinColumn(name = "request_id"))
    @MapKeyColumn(name = "portfolio_id")
    @Column(name = "image_base64", columnDefinition = "LONGTEXT")
    private Map<Long, String> barChartImages;

    @ElementCollection
    @CollectionTable(name = "pdf_request_line_charts", joinColumns = @JoinColumn(name = "request_id"))
    @MapKeyColumn(name = "portfolio_id")
    @Column(name = "image_base64", columnDefinition = "LONGTEXT")
    private Map<Long, String> lineChartImages;

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

	public LocalDateTime getRequestedAt() {
		return requestedAt;
	}

	public void setRequestedAt(LocalDateTime requestedAt) {
		this.requestedAt = requestedAt;
	}

	public boolean isApproved() {
		return approved;
	}

	public void setApproved(boolean approved) {
		this.approved = approved;
	}

	public boolean isProcessed() {
		return processed;
	}

	public void setProcessed(boolean processed) {
		this.processed = processed;
	}

	public List<Portfolio> getPortfolios() {
		return portfolios;
	}

	public void setPortfolios(List<Portfolio> portfolios) {
		this.portfolios = portfolios;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Map<Long, String> getPieChartImages() {
		return pieChartImages;
	}

	public void setPieChartImages(Map<Long, String> pieChartImages) {
		this.pieChartImages = pieChartImages;
	}

	public Map<Long, String> getBarChartImages() {
		return barChartImages;
	}

	public void setBarChartImages(Map<Long, String> barChartImages) {
		this.barChartImages = barChartImages;
	}

	public Map<Long, String> getLineChartImages() {
		return lineChartImages;
	}

	public void setLineChartImages(Map<Long, String> lineChartImages) {
		this.lineChartImages = lineChartImages;
	}
    
}
