import React, { useEffect, useState } from "react";
import axios from "axios";
import "../client/css/Home.css";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
 
ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);
 
const Home = () => {
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
 
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/admin/stocks")
      .then((res) => {
        setStocks(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching stocks:", err);
        setIsLoading(false);
      });
  }, []);
 
  const topStocks = [...stocks]
    .sort((a, b) => b.currentPrice - a.currentPrice)
    .slice(0, 5);
 
  const totalCompanies = stocks.length;
  const totalMarketValue = stocks.reduce(
    (sum, stock) => sum + stock.totalStocks * stock.currentPrice,
    0
  );
  const totalStocks = stocks.reduce((sum, stock) => sum + stock.totalStocks, 0);
 
  const typeCounts = stocks.reduce((acc, stock) => {
    acc[stock.stockType] = (acc[stock.stockType] || 0) + 1;
    return acc;
  }, {});
 
  const nationalStocks = stocks.filter((stock) => stock.stockType === "NATIONAL");
  const internationalStocks = stocks.filter((stock) => stock.stockType === "INTERNATIONAL");
 
  // ✅ Updated to use total stocks per company
  const nationalCompanyStockCounts = nationalStocks.reduce((acc, stock) => {
    acc[stock.companyName] = (acc[stock.companyName] || 0) + stock.totalStocks;
    return acc;
  }, {});
 
  const internationalCompanyStockCounts = internationalStocks.reduce((acc, stock) => {
    acc[stock.companyName] = (acc[stock.companyName] || 0) + stock.totalStocks;
    return acc;
  }, {});
 
  const pieOptions = {
    plugins: {
      datalabels: {
        color: "#fff",
        formatter: (value, context) => {
          const total = context.dataset.data.reduce((sum, data) => sum + data, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${percentage}%`;
        },
        font: {
          weight: "bold",
          size: 13
        }
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const total = tooltipItem.dataset.data.reduce((sum, data) => sum + data, 0);
            const percentage = ((tooltipItem.raw / total) * 100).toFixed(2);
            return `${tooltipItem.label}: ${tooltipItem.raw} (${percentage}%)`;
          }
        }
      }
    }
  };
 
  const pieData = {
    labels: Object.keys(typeCounts),
    datasets: [
      {
        data: Object.values(typeCounts),
        backgroundColor: ["#007bff", "#dc3545"],
        borderColor: "#f8f9fa",
        borderWidth: 2
      }
    ]
  };
 
  const recentStocks = [...stocks].sort((a, b) => b.id - a.id).slice(0, 5);
 
  return (
    <div className="home-container">
      <h2 className="home-title">📊 Dashboard Overview</h2>
 
      {isLoading ? (
        <p>Loading stocks...</p>
      ) : (
        <>
          <div className="card-container">
            <div className="mini-card">
              <h5>Companies</h5>
              <p>{totalCompanies}</p>
            </div>
            <div className="mini-card">
              <h5>Stocks</h5>
              <p>{totalStocks}</p>
            </div>
            <div className="mini-card">
              <h5>Market Value</h5>
              <p>${totalMarketValue.toFixed(2)}</p>
            </div>
            <div className="pie-wrapper">
              <h4>Stock Type Distribution</h4>
              <Pie data={pieData} options={pieOptions} />
            </div>
          </div>
 
          <div className="double-chart-container">
            <div className="chart-section">
              <h4>📈 National Stocks</h4>
              <div className="pie-wrapper">
                <Pie
                  data={{
                    labels: Object.keys(nationalCompanyStockCounts),
                    datasets: [
                      {
                        data: Object.values(nationalCompanyStockCounts),
                        backgroundColor: Object.keys(nationalCompanyStockCounts).map(
                          (_, i) =>
                            ["#28a745", "#17a2b8", "#ffc107", "#20c997", "#6610f2"][i % 5]
                        ),
                        borderColor: "#f8f9fa",
                        borderWidth: 2
                      }
                    ]
                  }}
                  options={pieOptions}
                />
              </div>
            </div>
 
            <div className="chart-section">
              <h4>🌐 International Stocks</h4>
              <div className="pie-wrapper">
                <Pie
                  data={{
                    labels: Object.keys(internationalCompanyStockCounts),
                    datasets: [
                      {
                        data: Object.values(internationalCompanyStockCounts),
                        backgroundColor: Object.keys(internationalCompanyStockCounts).map(
                          (_, i) =>
                            ["#6f42c1", "#fd7e14", "#20c997", "#e83e8c", "#17a2b8"][i % 5]
                        ),
                        borderColor: "#f8f9fa",
                        borderWidth: 2
                      }
                    ]
                  }}
                  options={pieOptions}
                />
              </div>
            </div>
          </div>
 
          <div className="top-stocks-section">
            <h4>🏆 Top Performing Stocks</h4>
            <ul className="styled-list">
              {topStocks.map((stock) => (
                <li key={stock.id}>
                  <strong>{stock.companyName}</strong> - ${stock.currentPrice} ({stock.stockType})
                </li>
              ))}
            </ul>
          </div>
 
          <div className="recent-stocks-section">
            <h4>🆕 Recently Added Stocks</h4>
            <ul className="styled-list">
              {recentStocks.map((stock) => (
                <li key={stock.id}>
                  <strong>{stock.companyName}</strong> - {stock.totalStocks} stocks @ ${stock.currentPrice}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};
 
export default Home;