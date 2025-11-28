//package com.advice.suite.util;
//
//import com.advice.suite.entity.PdfRequest;
//import com.advice.suite.entity.Portfolio;
//import com.advice.suite.entity.UserStock;
//import com.itextpdf.text.*;
//import com.itextpdf.text.pdf.*;
//
//import java.io.ByteArrayOutputStream;
//import java.io.IOException;
//import java.math.BigDecimal;
//import java.util.Base64;
//import java.util.Map;
//import java.util.stream.Stream;
//
//public class PdfGenerator {
//
//    public static byte[] generatePdf(PdfRequest request) {
//        try {
//            Document document = new Document();
//            ByteArrayOutputStream baos = new ByteArrayOutputStream();
//            PdfWriter.getInstance(document, baos);
//            document.open();
//
//            Map<Long, String> pieCharts = request.getPieChartImages();
//            Map<Long, String> barCharts = request.getBarChartImages();
//            Map<Long, String> lineCharts = request.getLineChartImages();
//
//            Font titleFont = new Font(Font.FontFamily.HELVETICA, 16, Font.BOLD);
//            Paragraph title = new Paragraph("Client Portfolio Report", titleFont);
//            title.setAlignment(Element.ALIGN_CENTER);
//            document.add(title);
//            document.add(Chunk.NEWLINE);
//
//            Font infoFont = new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL);
//            document.add(new Paragraph("Client Beta ID: " + request.getBetaId(), infoFont));
//            document.add(new Paragraph("Generated At: " +
//                    request.getRequestedAt().format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")), infoFont));
//            document.add(Chunk.NEWLINE);
//
//            for (Portfolio p : request.getPortfolios()) {
//                Font portfolioFont = new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD);
//                document.add(new Paragraph("Portfolio: " + p.getName(), portfolioFont));
//                document.add(new Paragraph("Description: " + p.getDescription(), infoFont));
//                document.add(new Paragraph("Trade Account: " + p.getTradeAccount(), infoFont));
//                document.add(Chunk.NEWLINE);
//
//                PdfPTable table = new PdfPTable(5);
//                table.setWidthPercentage(100);
//                table.setSpacingBefore(5f);
//                table.setSpacingAfter(5f);
//
//                Stream.of("Stock Name", "Quantity", "Purchase Value", "Current Value", "Gain/Loss")
//                        .forEach(header -> {
//                            PdfPCell cell = new PdfPCell(new Phrase(header));
//                            cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
//                            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
//                            table.addCell(cell);
//                        });
//
//                for (UserStock s : p.getSelectedUserStocks()) {
//                    PdfPCell nameCell = new PdfPCell(new Phrase(s.getStockName()));
//                    nameCell.setHorizontalAlignment(Element.ALIGN_CENTER);
//                    table.addCell(nameCell);
//
//                    PdfPCell quantityCell = new PdfPCell(new Phrase(String.valueOf(s.getQuantity())));
//                    quantityCell.setHorizontalAlignment(Element.ALIGN_CENTER);
//                    table.addCell(quantityCell);
//
//                    PdfPCell purchaseCell = new PdfPCell(new Phrase("₹" + s.getPurchaseValue()));
//                    purchaseCell.setHorizontalAlignment(Element.ALIGN_CENTER);
//                    table.addCell(purchaseCell);
//
//                    PdfPCell currentCell = new PdfPCell(new Phrase("₹" + s.getCurrentValue()));
//                    currentCell.setHorizontalAlignment(Element.ALIGN_CENTER);
//                    table.addCell(currentCell);
//
//                    BigDecimal gainLoss = s.getCurrentValue().subtract(s.getPurchaseValue());
//                    Font gainLossFont = new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL,
//                            gainLoss.compareTo(BigDecimal.ZERO) >= 0 ? BaseColor.GREEN : BaseColor.RED);
//                    PdfPCell gainLossCell = new PdfPCell(new Phrase("₹" + gainLoss, gainLossFont));
//                    gainLossCell.setHorizontalAlignment(Element.ALIGN_CENTER);
//                    table.addCell(gainLossCell);
//                }
//
//
//                document.add(table);
//                Paragraph divider = new Paragraph("------------------------------------------------------------");
//                divider.setAlignment(Element.ALIGN_CENTER);
//                document.add(divider);
//                document.add(Chunk.NEWLINE);
//
//                // Add charts
//                addChartToDocument(pieCharts, p.getId(), document, "Pie Chart");
//                addChartToDocument(barCharts, p.getId(), document, "Bar Chart");
//                addChartToDocument(lineCharts, p.getId(), document, "Line Chart");
//            }
//
//            document.close();
//            return baos.toByteArray();
//        } catch (Exception e) {
//            throw new RuntimeException("Failed to generate PDF", e);
//        }
//    }
//    
//    private static void addChartToDocument(Map<Long, String> chartMap, Long portfolioId, Document document, String chartTitle) {
//        try {
//            // Get the base64 encoded chart image for the given portfolioId
//            String chartBase64 = chartMap.get(portfolioId);
//
//            if (chartBase64 != null && !chartBase64.isEmpty()) {
//                byte[] decodedBytes = Base64.getDecoder().decode(chartBase64);
//                Image chartImage = Image.getInstance(decodedBytes);
//                chartImage.scaleToFit(500, 300); // Adjust size if necessary
//
//                // Add the chart image to the document
//                Paragraph chartParagraph = new Paragraph(chartTitle, new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD));
//                document.add(chartParagraph);
//                document.add(chartImage);
//                document.add(Chunk.NEWLINE); // Add space after the image
//            } else {
////                document.add(new Paragraph(chartTitle + " - No chart available"));
//            }
//        } catch (Exception e) {
//            throw new RuntimeException("Failed to add chart to PDF", e);
//        }
//    }
//
////    private static void addChartToDocument(Map<Long, String> chartMap, Long portfolioId, Document document, String chartTitle) {
////        try {
////            if (chartMap != null && chartMap.containsKey(portfolioId)) {
////                String base64Image = chartMap.get(portfolioId);
////                if (base64Image != null && !base64Image.isEmpty()) {
////                    byte[] imageBytes = Base64.getDecoder().decode(base64Image);
////                    Image image = Image.getInstance(imageBytes);
////                    image.scaleToFit(500, 300);  // Resize as needed
////                    image.setAlignment(Image.ALIGN_CENTER);
////
////                    Font titleFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
////                    Paragraph chartTitlePara = new Paragraph(chartTitle, titleFont);
////                    chartTitlePara.setAlignment(Element.ALIGN_CENTER);
////                    document.add(chartTitlePara);
////                    document.add(image);
////                    document.add(Chunk.NEWLINE);
////                }
////            }
////        } catch (Exception e) {
////            throw new RuntimeException("Failed to embed " + chartTitle + " for portfolio ID " + portfolioId, e);
////        }
////    }
//
//}
