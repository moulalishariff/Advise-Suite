package com.advice.suite.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.advice.suite.dto.StockDto;
import com.advice.suite.service.StockService;

@RestController
@RequestMapping("/api/admin/stocks")
public class StockController {

    @Autowired
    private StockService stockService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StockDto> addStock(@RequestBody StockDto stockDto) {
        StockDto createdStock = stockService.addStock(stockDto);
        return ResponseEntity.ok(createdStock);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StockDto> updateStock(
            @PathVariable("id") Long id,
            @RequestBody StockDto stockDto) {
        StockDto updatedStock = stockService.updateStock(id, stockDto);
        return ResponseEntity.ok(updatedStock);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteStock(@PathVariable("id") Long id) {
        stockService.deleteStock(id);
        return ResponseEntity.ok("Stock deleted successfully");
    }

    @GetMapping
    public ResponseEntity<List<StockDto>> getAllStocks() {
        List<StockDto> stocks = stockService.getAllStocks();
        return ResponseEntity.ok(stocks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StockDto> getStockById(@PathVariable("id") Long id) {
        StockDto stock = stockService.getStockById(id);
        return ResponseEntity.ok(stock);
    }
}
