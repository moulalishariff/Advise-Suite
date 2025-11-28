import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./css/PortfolioManagement.css";

const PortfolioManagement = ({ betaId }) => {
  const [portfolios, setPortfolios] = useState([]);

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

  return (
    <div className="portfolio-mgmt-container">
      <ToastContainer />
      <h2>My Portfolios</h2>

      <div className="portfolio-list">
        {portfolios.map((p) => (
          <div key={p.id} className="portfolio-card">
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <p><strong>Trade Account:</strong> {p.tradeAccount}</p>
            <h4>Holdings</h4>
            <ul>
              {p.selectedUserStocks?.map((stock, idx) => (
                <li key={idx}>
                  {stock.stockName} - Qty: {stock.quantity}, Bought at: ${stock.purchaseValue}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioManagement;
