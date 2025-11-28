//package com.advice.suite.controller;
//
//import org.springframework.web.bind.annotation.RequestMapping;
//
//import com.advice.suite.dto.ChartImageDTO;
//import com.advice.suite.dto.ChartUploadRequest;
//import com.advice.suite.dto.PdfRequestDTO;
//import com.advice.suite.entity.PdfRequest;
//import com.advice.suite.enums.ChartType;
//import com.advice.suite.service.PdfRequestService;
//
//import java.util.List;
//import java.util.Map;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@CrossOrigin(origins="http://localhost:3000")
//@RestController
//@RequestMapping("/api/pdf")
//public class PdfRequestController {
//
//    @Autowired
//    private PdfRequestService pdfRequestService;
//
////    @PostMapping("/request")
////    public ResponseEntity<String> requestPdf(@RequestBody PdfRequestDTO dto) {
////        pdfRequestService.createRequest(dto);
////        return ResponseEntity.ok("Request submitted to consultants.");
////    }
//    @PostMapping("/request")
//    public ResponseEntity<String> requestPdf(@RequestBody PdfRequestDTO dto) {
//        // dto contains: betaId, portfolioIds, chartImages (as List<String>)
//    	pdfRequestService.createRequest(dto);
//        return ResponseEntity.ok("PDF request submitted successfully.");
//    }
//
//    @PostMapping("/approve/{id}")
//    public ResponseEntity<String> approvePdf(@PathVariable("id") Long id) {
//        pdfRequestService.approveAndSend(id);
//        return ResponseEntity.ok("PDF sent to client.");
//    }
//
//    public PdfRequestController(PdfRequestService pdfRequestService) {
//        this.pdfRequestService = pdfRequestService;
//    }
//
//    @GetMapping("/pending")
//    public ResponseEntity<List<PdfRequest>> getPendingRequests() {
//        List<PdfRequest> pendingRequests = pdfRequestService.getPendingRequests();
//        return ResponseEntity.ok(pendingRequests);
//    }
//    
//  
//
//    @PostMapping("/{requestId}/respond")
//    public ResponseEntity<String> respondToRequest(
//            @PathVariable("requestId") Long requestId,
//            @RequestParam("action") String action
//    ) {
//        boolean success = pdfRequestService.handleRequestResponse(requestId, action);
//
//        if (!success) {
//            return ResponseEntity.badRequest().body("Invalid request or already processed.");
//        }
//
//        return ResponseEntity.ok("Request " + action + "ed successfully.");
//    }
//}
//
