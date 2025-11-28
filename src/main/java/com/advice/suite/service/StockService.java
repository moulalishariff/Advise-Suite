package com.advice.suite.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.advice.suite.dto.StockDto;
import com.advice.suite.dto.UserStockDto;
import com.advice.suite.entity.Stock;
import com.advice.suite.entity.UserStock;
import com.advice.suite.repository.StockRepository;
import com.advice.suite.repository.UserStockRepository;

@Service
public class StockService {

    @Autowired
    private StockRepository stockRepo;
    @Autowired
    private UserStockRepository userStockRepository;

    public StockDto addStock(StockDto stockDto) {
        Stock stock = new Stock();
        stock.setCompanyName(stockDto.getCompanyName());
        stock.setTotalStocks(stockDto.getTotalStocks());
        stock.setAvailableStocks(stockDto.getAvailableStocks());
        stock.setCurrentPrice(stockDto.getCurrentPrice());
        stock.setStockType(stockDto.getStockType());

        stock = stockRepo.save(stock);

        return mapToDto(stock);
    }

    public StockDto updateStock(Long id, StockDto stockDto) {
        Optional<Stock> optionalStock = stockRepo.findById(id);
        if (optionalStock.isEmpty()) {
            throw new RuntimeException("Stock with ID " + id + " not found");
        }

        Stock stock = optionalStock.get();
        stock.setCompanyName(stockDto.getCompanyName());
        stock.setTotalStocks(stockDto.getTotalStocks());
        stock.setAvailableStocks(stockDto.getAvailableStocks());
        stock.setCurrentPrice(stockDto.getCurrentPrice());
        stock.setStockType(stockDto.getStockType());

        stock = stockRepo.save(stock);

        // ✅ Add this block to update all user stocks related to this stock
        List<UserStock> userStocks = userStockRepository.findByStockName(stock.getCompanyName());
        for (UserStock us : userStocks) {
            BigDecimal currentValue = stock.getCurrentPrice().multiply(BigDecimal.valueOf(us.getQuantity()));
            us.setCurrentValue(currentValue);

            BigDecimal purchaseValue = us.getPurchasePricePerUnit().multiply(BigDecimal.valueOf(us.getQuantity()));
            us.setPotentialGainLoss(currentValue.subtract(purchaseValue));
        }
        userStockRepository.saveAll(userStocks);

        return mapToDto(stock);
    }


    public void deleteStock(Long id) {
        if (!stockRepo.existsById(id)) {
            throw new RuntimeException("Stock with ID " + id + " not found");
        }
        stockRepo.deleteById(id);
    }

    public List<StockDto> getAllStocks() {
        List<Stock> stocks = stockRepo.findAll();
        return stocks.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public StockDto getStockById(Long id) {
        Stock stock = stockRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock with ID " + id + " not found"));
        return mapToDto(stock);
    }
    
    private StockDto mapToDto(Stock stock) {
        StockDto dto = new StockDto();
        dto.setId(stock.getId());
        dto.setCompanyName(stock.getCompanyName());
        dto.setTotalStocks(stock.getTotalStocks());
        dto.setAvailableStocks(stock.getAvailableStocks());
        dto.setCurrentPrice(stock.getCurrentPrice());
        dto.setStockType(stock.getStockType());
        return dto;
    }
    public UserStockDto mapToDto(UserStock userStock) {
        UserStockDto dto = new UserStockDto();
        dto.setId(userStock.getId());
        dto.setStockName(userStock.getStockName());
        dto.setQuantity(userStock.getQuantity());
        dto.setBoughtAt(userStock.getBoughtAt());
        dto.setPurchasePricePerUnit(userStock.getPurchasePricePerUnit());
        
        // ✅ Use stored values from DB
        dto.setCurrentValue(userStock.getCurrentValue());
        dto.setPotentialGainLoss(userStock.getPotentialGainLoss());

        return dto;
    }

}
