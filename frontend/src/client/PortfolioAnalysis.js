import React, { useEffect, useState, useCallback } from "react";
import Modal from "react-modal";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
  LabelList,
} from "recharts";
import "react-toastify/dist/ReactToastify.css";
import "./css/PortfolioAnalysis.css";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import {sendPDFToBackend} from "./generatePdf";
 
Modal.setAppElement("#root");
 
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a9cdf1", "#dc3545"];
 
const PortfolioAnalysis = ({ betaId }) => {
  const [portfolios, setPortfolios] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
 
  const fetchPortfolios = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/portfolios/${betaId}`);
      setPortfolios(res.data);
    } catch (err) {
      toast.error("Failed to fetch portfolios.");
    }
  }, [betaId]);
 
  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  const openModal = (portfolio) => {
    setSelectedPortfolio(portfolio);
    setModalOpen(true);
  };
 
  const closeModal = () => {
    setModalOpen(false);
    setSelectedPortfolio(null);
  };
  
const generatePDFBlob = async () => {
  const downloadElement = document.getElementById("portfolio-details");

  await new Promise(resolve => requestAnimationFrame(resolve));

  const canvas = await html2canvas(downloadElement, { scale: 2, useCORS: true });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = canvas.width;
  const imgHeight = canvas.height;

  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

  const imgW = imgWidth * ratio;
  const imgH = imgHeight * ratio;

  const imgX = (pdfWidth - imgW) / 2;
  const imgY = (pdfHeight - imgH) / 2;

  pdf.addImage(imgData, "PNG", imgX, imgY, imgW, imgH);
  return pdf;
};

const handleDownloadPDFToBrowser = async () => {
  try {
    const pdf = await generatePDFBlob();
    pdf.save("Portfolio_Report.pdf");
    toast.success("PDF Downloaded Successfully.");
  } catch (err) {
    console.error("Error downloading PDF:", err);
    toast.error("Failed to download PDF.");
  }
};

const handleSendPDFByEmail = async () => {
  try {
    const pdf = await generatePDFBlob();
    const pdfBlob = pdf.output("blob");

    const userResponse = await axios.get(`http://localhost:8080/api/auth/${betaId}`);
    const clientEmail = userResponse.data.email;

    await sendPDFToBackend(pdfBlob, clientEmail);
    toast.success("PDF sent to client via email.");
  } catch (err) {
    console.error("Error sending PDF by email:", err);
    toast.error("Failed to send PDF via email.");
  }
};


  const renderChartsAndDetails = (p) => {
    const chartData =
      p.selectedUserStocks?.map((stock) => ({
        name: stock.stockName,
        Quantity: stock.quantity,
        PurchaseValue: stock.purchaseValue,
        UnitPrice: stock.purchaseValue / stock.quantity,
        CurrentPrice: stock.currentValue / stock.quantity,
      })) || [];
 
    const totalQuantity = chartData.reduce((sum, item) => sum + item.Quantity, 0);
 
    const pieData = chartData.map((item) => ({
      ...item,
      percentage: ((item.Quantity / totalQuantity) * 100).toFixed(2),
    }));
 
    const ct = new Date().toLocaleTimeString();
    const dt = new Date().toLocaleDateString();
 
    return (
      <div id="portfolio-details">
        <p>Client Beta ID: {p.betaId} </p>
        <p>Generated At: {ct} of {dt} </p>
        <h3>Portfolio: {p.name}</h3>
        <p>Description: {p.description}</p>
        <p><strong>Trade Account:</strong> {p.tradeAccount}</p>
 
        <h4>Holdings</h4>
        <table className="holdings-table">
          <thead>
            <tr>
              <th>Stock Name</th>
              <th>Quantity</th>
              <th>Purchase Price</th>
              <th>Current Value</th>
              <th>Gain/Loss</th>
            </tr>
          </thead>
          <tbody>
            {p.selectedUserStocks?.map((stock, idx) => {
              const currentValue = stock.currentValue || 0;
              const purchaseValue = stock.purchaseValue || 0;
              const gainLoss = currentValue - purchaseValue;
              const gainLossColor = gainLoss >= 0 ? "green" : "red";
              return (
                <tr key={idx}>
                  <td>{stock.stockName}</td>
                  <td>{stock.quantity}</td>
                  <td>${purchaseValue}</td>
                  <td>${currentValue}</td>
                  <td style={{ color: gainLossColor }}>${gainLoss}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ fontWeight: "bold" }}>
              <td colSpan="2">Total</td>
              <td>${p.selectedUserStocks?.reduce((sum, s) => sum + (s.purchaseValue || 0), 0)}</td>
              <td>${p.selectedUserStocks?.reduce((sum, s) => sum + (s.currentValue || 0), 0)}</td>
              <td style={{
                color: (p.selectedUserStocks?.reduce((sum, s) => sum + ((s.currentValue || 0) - (s.purchaseValue || 0)), 0)) >= 0 ? "green" : "red"
              }}>
                ${p.selectedUserStocks?.reduce((sum, s) => sum + ((s.currentValue || 0) - (s.purchaseValue || 0)), 0)}
              </td>
            </tr>
          </tfoot>
        </table>
 
        {/* Charts */}
        {chartData.length > 0 && (
          <>
            <div className="chart-wrapper">
              <h5>Holdings Distribution (Pie Chart)</h5>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="Quantity"
                    nameKey="name"
                    outerRadius={80}
                    label={({ percentage }) => `${percentage}%`}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartTooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="legend-box">
                {pieData.map((entry, index) => (
                  <div key={index} className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    <span className="legend-text">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
 
            <div className="chart-wrapper">
              <h5>Holdings Purchase Price (Bar Chart)</h5>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartTooltip formatter={(value, name) => [`$${value}`, name]} />
                  <Bar dataKey="UnitPrice" fill="#007bff" barSize={30}>
                    <LabelList dataKey="Quantity" position="top" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
 
            <div className="chart-wrapper">
              <h5>Purchase vs Current Price (Line Chart)</h5>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartTooltip formatter={(value, name) => [`$${value}`, name]} />
                  <Legend />
                  <Line type="monotone" dataKey="UnitPrice" stroke="#8884d8" name="Purchase Price" />
                  <Line type="monotone" dataKey="CurrentPrice" stroke="#82ca9d" name="Current Price" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    );
  };
 
  return (
    <div className="portfolio-mgmt-container">
      <ToastContainer />
      <h2>Client Portfolios</h2>
 
      <div className="portfolio-list">
        {portfolios.map((p) => (
          <div key={p.id} className="portfolio-card" style={{ cursor: "pointer" }}>
            {/* <input
              type="checkbox"
              checked={selectedPortfolios.includes(p.id)}
              onChange={() => handleCheckboxChange(p.id)}
            /> */}
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <p><strong>Trade Account:</strong> {p.tradeAccount}</p>
            <Link onClick={() => openModal(p)}>Click to view details</Link>
          </div>
        ))}
      </div>
 
      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        contentLabel="Portfolio Details"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <button onClick={closeModal} className="modal-close-btn">X</button>
        <div className="modal-actions">
          <button onClick={handleDownloadPDFToBrowser} className="download-pdf-btn">
            Download PDF
          </button>
          <button onClick={handleSendPDFByEmail} className="send-pdf-btn">
            Share to Email
          </button>
        </div>

                {/* <button onClick={handleDownloadPDF} className="download-pdf-btn">Download PDF</button> */}
                {selectedPortfolio && renderChartsAndDetails(selectedPortfolio)}
              </Modal>
    </div>
  );
};
 
export default PortfolioAnalysis;