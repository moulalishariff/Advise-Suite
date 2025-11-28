import React, { useEffect, useState } from "react";
import axios from "axios";
import "../consultant/css/ConsultantDashboard.css";

function ConRebalancing({ betaId }) {
  const [userStocks, setUserStocks] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userStockRes, historyRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/user-stocks/${betaId}`),
          axios.get(`http://localhost:8080/api/user-stock-transactions/${betaId}/transactions`),
        ]);
        setUserStocks(userStockRes.data);
        setTransactionHistory(historyRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    if (betaId) {
      fetchData();
    }
  }, [betaId]);

  return (
    <div className="rebalancing-tab">
      <h2>Client Rebalancing Overview</h2>

      <h3>Current Holdings</h3>
      <table className="accounts-table">
        <thead>
          <tr>
            <th>Stock</th>
            <th>Quantity</th>
            <th>Purchase Value</th>
            <th>Current Value</th>
            <th>Potential Gain/Loss</th>
            <th>Bought At</th>
          </tr>
        </thead>
        <tbody>
          {userStocks.length > 0 ? (
            userStocks.map((stock, idx) => (
              <tr key={idx}>
                <td>{stock.stockName}</td>
                <td>{stock.quantity}</td>
                <td>${(stock.purchaseValue / stock.quantity).toFixed(2)}</td>
                <td>${stock.currentValue.toFixed(2)}</td>
                <td
                  style={{
                    color: stock.potentialGainLoss >= 0 ? "green" : "red",
                  }}
                >
                  {stock.potentialGainLoss >= 0
                    ? `+$${stock.potentialGainLoss.toFixed(2)}`
                    : `-$${Math.abs(stock.potentialGainLoss).toFixed(2)}`}
                </td>
                <td>{new Date(stock.boughtAt).toLocaleString("en-IN")}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No holdings available.</td>
            </tr>
          )}
        </tbody>
      </table>

      <h3>Transaction History</h3>
      <table className="accounts-table">
        <thead>
          <tr>
            <th>Stock</th>
            <th>Action</th>
            <th>Quantity</th>
            <th>Value</th>
            <th>Transacted At</th>
          </tr>
        </thead>
        <tbody>
          {transactionHistory.length > 0 ? (
            transactionHistory.map((tx, idx) => (
              <tr key={idx}>
                <td>{tx.stockName}</td>
                <td style={{ color: tx.action === "buy" ? "green" : "red" }}>
                  {tx.action}
                </td>
                <td>{tx.quantity}</td>
                <td>${parseFloat(tx.value).toFixed(2)}</td>
                <td>{new Date(tx.transactedAt).toLocaleString("en-IN")}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No transactions found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ConRebalancing;
