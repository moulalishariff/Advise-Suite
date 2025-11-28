package com.advice.suite.service;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.advice.suite.dto.PortfolioRequest;
import com.advice.suite.entity.Portfolio;
import com.advice.suite.entity.Stock;
import com.advice.suite.entity.UserStock;
import com.advice.suite.repository.PortfolioRepository;
import com.advice.suite.repository.StockRepository;
import com.advice.suite.repository.UserStockRepository;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class PortfolioService {
    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private UserStockRepository userStockRepository;


    public List<Portfolio> getPortfoliosByBetaId(String betaId) {
        return portfolioRepository.findByBetaId(betaId);
    }

    public Portfolio createPortfolio(PortfolioRequest request) {
        Portfolio portfolio = new Portfolio();
        portfolio.setName(request.getName());
        portfolio.setDescription(request.getDescription());
        portfolio.setTradeAccount(request.getTradeAccount());
        portfolio.setBetaId(request.getBetaId());

        List<UserStock> selectedUserStocks = userStockRepository.findAllById(request.getSelectedUserStockIds());

        // Debug log
        System.out.println("Creating Portfolio:");
        System.out.println("Name: " + request.getName());
        System.out.println("Selected UserStock IDs: " + request.getSelectedUserStockIds());
        System.out.println("Fetched UserStocks: " + selectedUserStocks.size());

        for (UserStock us : selectedUserStocks) {
            System.out.println(" - " + us.getStockName() + ", ID: " + us.getId());
        }

        portfolio.setSelectedUserStocks(selectedUserStocks);

        return portfolioRepository.save(portfolio);
    }

    
    public Portfolio updatePortfolio(Long id, PortfolioRequest request) {
        Portfolio portfolio = portfolioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Portfolio not found"));

        portfolio.setName(request.getName());
        portfolio.setDescription(request.getDescription());
        portfolio.setTradeAccount(request.getTradeAccount());

        List<UserStock> selectedUserStocks = userStockRepository.findAllById(request.getSelectedUserStockIds());
        portfolio.setSelectedUserStocks(selectedUserStocks);

        return portfolioRepository.save(portfolio);
    }
    
    public void deletePortfolio(Long id) {
        Portfolio portfolio = portfolioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Portfolio not found"));
        
        // Clear associations with user stocks
        portfolio.getSelectedUserStocks().clear();

        // Save the portfolio to apply the change in the join table
        portfolioRepository.save(portfolio);

        // Now delete the portfolio
        portfolioRepository.delete(portfolio);
    }
    @Autowired
    private JavaMailSender mailSender;

    public void sendPortfolioPdfToClient(MultipartFile pdf, String clientEmail) throws MailException, MessagingException, IOException {
        // Create email message
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, true);

        messageHelper.setTo(clientEmail);
        messageHelper.setSubject("Your Portfolio Report");
        messageHelper.setText("Please find attached your portfolio report.");

        // Convert the PDF to a Resource for attachment
        Resource resource = new ByteArrayResource(pdf.getBytes());

        // Add the PDF as an attachment
        messageHelper.addAttachment("Portfolio-Report.pdf", resource);

        // Send the email
        mailSender.send(mimeMessage);
    }

}
