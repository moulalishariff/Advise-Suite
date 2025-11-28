package com.advice.suite.service;

import com.advice.suite.dto.UserStockDto;
import com.advice.suite.entity.Portfolio;
import com.advice.suite.entity.Stock;
import com.advice.suite.entity.TradeAccount;
import com.advice.suite.entity.UserStock;
import com.advice.suite.repository.PortfolioRepository;
import com.advice.suite.repository.StockRepository;
import com.advice.suite.repository.TradeAccountRepository;
import com.advice.suite.repository.UserStockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserStockService {

    @Autowired
    private UserStockRepository userStockRepository;

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private TradeAccountRepository tradeAccountRepository;

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private UserStockTransactionService transactionService;

    public List<UserStockDto> getUserStocks(String betaId) {
        return userStockRepository.findByBetaId(betaId)
                .stream()
                .map(userStock -> {
                    BigDecimal currentPrice = stockRepository.findByCompanyName(userStock.getStockName())
                            .map(Stock::getCurrentPrice)
                            .orElse(BigDecimal.ZERO);

                    BigDecimal currentValue = currentPrice.multiply(BigDecimal.valueOf(userStock.getQuantity()));
                    BigDecimal gainLoss = currentPrice.subtract(userStock.getPurchasePricePerUnit())
                            .multiply(BigDecimal.valueOf(userStock.getQuantity()));

                    UserStockDto dto = UserStockDto.fromEntity(userStock);
                    dto.setCurrentValue(currentValue);
                    dto.setPotentialGainLoss(gainLoss);
                    return dto;
                })

                .collect(Collectors.toList());
    }

    public UserStockDto buyStock(String betaId, String stockName, int quantity, String accountNumber) {
        Stock stock = stockRepository.findByCompanyName(stockName)
                .orElseThrow(() -> new RuntimeException("Stock not found"));

        if (stock.getAvailableStocks() < quantity) {
            throw new RuntimeException("Not enough stock available");
        }

        BigDecimal totalPrice = stock.getCurrentPrice().multiply(BigDecimal.valueOf(quantity));
        
        TradeAccount account = tradeAccountRepository.findByAccountNumberAndBetaId(accountNumber, betaId)
                .orElseThrow(() -> new RuntimeException("Account not found or not owned by user"));

        if (account.getBalance().compareTo(totalPrice) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        account.setBalance(account.getBalance().subtract(totalPrice));
        stock.setAvailableStocks(stock.getAvailableStocks() - quantity);

        tradeAccountRepository.save(account);
        stockRepository.save(stock);

        UserStock userStock = new UserStock();
        userStock.setBetaId(betaId);
        userStock.setStockName(stockName);
        userStock.setQuantity(quantity);
        userStock.setPurchasePricePerUnit(stock.getCurrentPrice());
        BigDecimal purchaseValue = stock.getCurrentPrice().multiply(BigDecimal.valueOf(quantity));
        userStock.setPurchaseValue(purchaseValue);  // Make sure this field exists in your entity

        // Optional: set current value immediately, or compute later during display
        userStock.setCurrentValue(purchaseValue);  // Assuming current price = purchase price at buy time

        userStock.setPotentialGainLoss(BigDecimal.ZERO);
        userStock.setBoughtAt(LocalDateTime.now());

        userStock = userStockRepository.save(userStock);

        transactionService.recordTransaction(
                betaId,
                stockName,
                quantity,
                totalPrice,
                "buy"
        );

        return UserStockDto.fromEntity(userStock);
    }


    public UserStockDto sellStock(String betaId, String stockName, int quantity, String accountNumber) {
        List<UserStock> userStocks = userStockRepository.findByBetaIdAndStockName(betaId, stockName);
        int totalOwned = userStocks.stream().mapToInt(UserStock::getQuantity).sum();

        if (totalOwned < quantity) {
            throw new RuntimeException("Not enough stock to sell");
        }

        Stock stock = stockRepository.findByCompanyName(stockName)
                .orElseThrow(() -> new RuntimeException("Stock not found"));

        TradeAccount account = tradeAccountRepository.findByAccountNumberAndBetaId(accountNumber, betaId)
                .orElseThrow(() -> new RuntimeException("Account not found or not owned by user"));

        BigDecimal currentPrice = stock.getCurrentPrice();
        BigDecimal saleValue = currentPrice.multiply(BigDecimal.valueOf(quantity));

        account.setBalance(account.getBalance().add(saleValue));
        stock.setAvailableStocks(stock.getAvailableStocks() + quantity);

        tradeAccountRepository.save(account);
        stockRepository.save(stock);

        int remaining = quantity;

        for (UserStock us : userStocks) {
            if (remaining <= 0) break;

            int userQuantity = us.getQuantity();

            if (userQuantity <= remaining) {
                remaining -= userQuantity;
                removeUserStockFromPortfolios(us);
                userStockRepository.delete(us);
            } else {
                // Update quantity
                int newQuantity = userQuantity - remaining;
                us.setQuantity(newQuantity);

                // Recalculate purchase value based on remaining quantity
                BigDecimal newPurchaseValue = us.getPurchasePricePerUnit().multiply(BigDecimal.valueOf(newQuantity));
                us.setPurchaseValue(newPurchaseValue);

                // Recalculate current value and gain/loss
                BigDecimal newCurrentValue = currentPrice.multiply(BigDecimal.valueOf(newQuantity));
                us.setCurrentValue(newCurrentValue);

                BigDecimal gainLoss = newCurrentValue.subtract(newPurchaseValue);
                us.setPotentialGainLoss(gainLoss);

                userStockRepository.save(us);
                remaining = 0;
            }
        }

        transactionService.recordTransaction(
                betaId,
                stockName,
                quantity,
                saleValue,
                "sell"
        );

        // Return updated UserStockDto for the remaining holdings (if any)
        Optional<UserStock> remainingStock = userStockRepository
                .findByBetaIdAndStockName(betaId, stockName)
                .stream().findFirst();

        if (remainingStock.isPresent()) {
            UserStock us = remainingStock.get();
            UserStockDto dto = new UserStockDto();
            dto.setId(us.getId());
            dto.setBetaId(betaId);
            dto.setStockName(stockName);
            dto.setQuantity(us.getQuantity());
            dto.setPurchasePricePerUnit(us.getPurchasePricePerUnit());
            dto.setCurrentValue(us.getCurrentValue());
            dto.setPotentialGainLoss(us.getPotentialGainLoss());
            dto.setBoughtAt(us.getBoughtAt());
            return dto;
        } else {
            // All stocks sold — return a basic DTO with sale info
            UserStockDto dto = new UserStockDto();
            dto.setBetaId(betaId);
            dto.setStockName(stockName);
            dto.setQuantity(0);
            dto.setCurrentValue(BigDecimal.ZERO);
            dto.setPotentialGainLoss(BigDecimal.ZERO);
            dto.setBoughtAt(LocalDateTime.now());
            return dto;
        }
    }

    private void removeUserStockFromPortfolios(UserStock userStock) {
        List<Portfolio> portfolios = portfolioRepository.findBySelectedUserStocks_Id(userStock.getId());
        
        for (Portfolio portfolio : portfolios) {
            portfolio.getSelectedUserStocks().removeIf(us -> us.getId().equals(userStock.getId()));
            portfolioRepository.save(portfolio);
        }
    }


    public void deleteStock(Long id) {
        UserStock userStock = userStockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("UserStock not found"));
        removeUserStockFromPortfolios(userStock);
        userStockRepository.deleteById(id);
    }
}
	