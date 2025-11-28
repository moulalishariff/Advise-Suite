//package com.advice.suite.service;
//
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.Map;
//import java.util.Optional;
//import java.util.UUID;
//import java.util.stream.Collectors;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.mail.javamail.MimeMessageHelper;
//import org.springframework.stereotype.Service;
//
//import com.advice.suite.dto.PdfRequestDTO;
//import com.advice.suite.entity.ChartImage;
//import com.advice.suite.entity.PdfRequest;
//import com.advice.suite.entity.Portfolio;
//import com.advice.suite.entity.User;
//import com.advice.suite.enums.ChartType;
//import com.advice.suite.repository.ChartImageRepository;
//import com.advice.suite.repository.PdfRequestRepository;
//import com.advice.suite.repository.PortfolioRepository;
//import com.advice.suite.repository.UserRepository;
//import com.advice.suite.util.PdfGenerator;
//import org.springframework.core.io.ByteArrayResource;
//
//import jakarta.mail.MessagingException;
//import jakarta.mail.internet.MimeMessage;
//
//@Service
//public class PdfRequestService {
//
//    @Autowired
//    private PdfRequestRepository pdfRequestRepository;
//
//    @Autowired
//    private PortfolioRepository portfolioRepository;
//    
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private JavaMailSender mailSender;
//
//    public void createRequest(PdfRequestDTO dto) {
//        PdfRequest request = new PdfRequest();
//        request.setBetaId(dto.getBetaId());
//        request.setStatus("PENDING");
//        request.setRequestedAt(LocalDateTime.now());
//        request.setProcessed(false);
//        request.setApproved(false);
//
//        List<Portfolio> portfolios = portfolioRepository.findAllById(dto.getPortfolioIds());
//        request.setPortfolios(portfolios);
//
//        pdfRequestRepository.save(request);
//
//        // Save chart images (without ChartType or PortfolioId, assuming generic order)
//        if (dto.getChartImages() != null) {
//            int chartIndex = 0;
//            for (String base64 : dto.getChartImages()) {
//                ChartImage image = new ChartImage();
//                image.setBetaId(dto.getBetaId());
//
//                // You may customize this logic to associate portfolioId or ChartType
//                if (chartIndex < dto.getPortfolioIds().size()) {
//                    image.setPortfolioId(dto.getPortfolioIds().get(chartIndex)); // Map 1:1 if same size
//                }
//
////                image.setType(ChartType.UNKNOWN); // Assuming you add UNKNOWN to your enum
////                image.setImageBase64(base64);
//
////                chartImageRepository.save(image);
////                chartIndex++;
//            }
//        }
//    }
//
////    public void approveAndSend(Long requestId) {
////        PdfRequest request = pdfRequestRepository.findById(requestId)
////                .orElseThrow(() -> new RuntimeException("Request not found"));
////
////        if (request.isProcessed()) {
////            throw new IllegalStateException("Request already processed");
////        }
////
////        List<Long> portfolioIds = request.getPortfolios().stream().map(Portfolio::getId).toList();
////
////        Map<Long, String> pieCharts = chartImageRepository
////                .findByBetaIdAndPortfolioIdInAndType(request.getBetaId(), portfolioIds, ChartType.PIE)
////                .stream().collect(Collectors.toMap(ChartImage::getPortfolioId, ChartImage::getImageBase64));
////
////        Map<Long, String> barCharts = chartImageRepository
////                .findByBetaIdAndPortfolioIdInAndType(request.getBetaId(), portfolioIds, ChartType.BAR)
////                .stream().collect(Collectors.toMap(ChartImage::getPortfolioId, ChartImage::getImageBase64));
////
////        Map<Long, String> lineCharts = chartImageRepository
////                .findByBetaIdAndPortfolioIdInAndType(request.getBetaId(), portfolioIds, ChartType.LINE)
////                .stream().collect(Collectors.toMap(ChartImage::getPortfolioId, ChartImage::getImageBase64));
//
////        request.setPieChartImages(pieCharts);
////        request.setBarChartImages(barCharts);
////        request.setLineChartImages(lineCharts);
////
////        request.setApproved(true);
////        request.setProcessed(true);
////        request.setStatus("APPROVED");
////        pdfRequestRepository.save(request);
////
////
////        // Generate the PDF and send it
////        byte[] pdfBytes = PdfGenerator.generatePdf(request);
////        sendPdfToClient(request.getBetaId(), pdfBytes);
////    }
////    @Autowired
////    private ChartImageRepository chartImageRepository;
//
//    public void approveAndSend(Long requestId) {
//        PdfRequest request = pdfRequestRepository.findById(requestId)
//                .orElseThrow(() -> new RuntimeException("Request not found"));
//
//        if (request.isProcessed()) {
//            throw new IllegalStateException("Request already processed");
//        }
//
//        List<Long> portfolioIds = request.getPortfolios().stream()
//                .map(Portfolio::getId)
//                .toList();
//
//        // Fetch chart images by betaId and portfolioId
////        Map<Long, String> pieCharts = chartImageRepository
////                .findByBetaIdAndPortfolioIdInAndType(request.getBetaId(), portfolioIds, ChartType.PIE)
////                .stream().collect(Collectors.toMap(ChartImage::getPortfolioId, ChartImage::getImageBase64));
////
////        Map<Long, String> barCharts = chartImageRepository
////                .findByBetaIdAndPortfolioIdInAndType(request.getBetaId(), portfolioIds, ChartType.BAR)
////                .stream().collect(Collectors.toMap(ChartImage::getPortfolioId, ChartImage::getImageBase64));
////
////        Map<Long, String> lineCharts = chartImageRepository
////                .findByBetaIdAndPortfolioIdInAndType(request.getBetaId(), portfolioIds, ChartType.LINE)
////                .stream().collect(Collectors.toMap(ChartImage::getPortfolioId, ChartImage::getImageBase64));
////
////        // Attach to request object so PdfGenerator can access them
////        request.setPieChartImages(pieCharts);
////        request.setBarChartImages(barCharts);
////        request.setLineChartImages(lineCharts);
//
//        request.setApproved(true);
//        request.setProcessed(true);
//        request.setStatus("APPROVED");
//        pdfRequestRepository.save(request);
//
//        // Generate and send PDF
//        byte[] pdfBytes = PdfGenerator.generatePdf(request);
//        sendPdfToClient(request.getBetaId(), pdfBytes);
//    }
//
//    private void sendPdfToClient(String betaId, byte[] pdfBytes) {
//        // Lookup email based on betaId
//        Optional<User> optionalUser = userRepository.findByBetaId(betaId);
//        if (optionalUser.isEmpty()) {
//            throw new RuntimeException("User with betaId " + betaId + " not found");
//        }
//        User client = optionalUser.get();
//        String clientEmail = client.getEmail();
//
//        MimeMessage message = mailSender.createMimeMessage();
//        try {
//            MimeMessageHelper helper = new MimeMessageHelper(message, true);
//            helper.setTo(clientEmail);
//            helper.setSubject("Your Portfolio Report");
//            helper.setText("Attached is your requested portfolio report.");
//
//            helper.addAttachment("PortfolioReport.pdf", new ByteArrayResource(pdfBytes));
//
//            mailSender.send(message);
//        } catch (MessagingException e) {
//            throw new RuntimeException("Failed to send email", e);
//        }
//    }
//
//    public List<PdfRequest> getPendingRequests() {
//        return pdfRequestRepository.findByStatus("PENDING");
//    }
//
//    public boolean handleRequestResponse(Long requestId, String action) {
//        Optional<PdfRequest> optionalRequest = pdfRequestRepository.findById(requestId);
//        if (optionalRequest.isEmpty()) return false;
//
//        PdfRequest request = optionalRequest.get();
//
//        if (!"PENDING".equalsIgnoreCase(request.getStatus())) {
//            return false; // Already processed
//        }
//
//        if ("accept".equalsIgnoreCase(action)) {
//            approveAndSend(requestId); // ✅ This line sends the PDF
//        } else if ("reject".equalsIgnoreCase(action)) {
//            request.setStatus("REJECTED");
//            request.setProcessed(true);
//            request.setApproved(false);
//            pdfRequestRepository.save(request);
//        } else {
//            return false; // Invalid action
//        }
//
//        return true;
//    }
//    
////    public void saveChartImage(String betaId, Long portfolioId, ChartType type, String imageBase64) {
////        ChartImage image = new ChartImage();
////        image.setBetaId(betaId);
////        image.setPortfolioId(portfolioId);
////        image.setType(type);
////        image.setImageBase64(imageBase64);
////        chartImageRepository.save(image);
////    }
////    public String generateRequestId(String betaId) {
////        return betaId + "-" + UUID.randomUUID().toString();
////    }
//
//
//}
