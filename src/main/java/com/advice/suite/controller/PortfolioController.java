package com.advice.suite.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.advice.suite.dto.PortfolioRequest;
import com.advice.suite.entity.Portfolio;
import com.advice.suite.repository.StockRepository;
import com.advice.suite.service.EmailService;
import com.advice.suite.service.PortfolioService;

@CrossOrigin(origins="http://localhost:3000")
@RestController
@RequestMapping("/api/portfolios")
public class PortfolioController {

    @Autowired
    private PortfolioService portfolioService;

    @Autowired
    private StockRepository stockRepository;

    @GetMapping("/{betaId}")
    public List<Portfolio> getPortfolios(@PathVariable("betaId") String betaId) {
        return portfolioService.getPortfoliosByBetaId(betaId);
    }

    @PostMapping
    public Portfolio createPortfolio(@RequestBody PortfolioRequest request) {
        return portfolioService.createPortfolio(request);
    }

    @PutMapping("/{id}")
    public Portfolio updatePortfolio(@PathVariable("id") Long id, @RequestBody PortfolioRequest request) {
        return portfolioService.updatePortfolio(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePortfolio(@PathVariable("id") Long id) {
        portfolioService.deletePortfolio(id);
        return ResponseEntity.ok().build();
    }
    @Autowired
    private EmailService emailService;

    @PostMapping("/send-pdf-to-client")
    public ResponseEntity<String> sendPdfToClient(
            @RequestParam("pdf") MultipartFile pdf,
            @RequestParam("clientEmail") String clientEmail) {

        try {
            // Call service to send the email with the PDF attached
            portfolioService.sendPortfolioPdfToClient(pdf, clientEmail);
            System.out.println("PDF sent successfully to client.");
            return ResponseEntity.ok("PDF sent successfully to client.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send PDF: " + e.getMessage());
        }
    }
}
