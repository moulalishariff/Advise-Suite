import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../client/css/Rebalancing.css";
 
function Rebalancing({ betaId }) {
  const [availableStocks, setAvailableStocks] = useState([]);
  const [userStocks, setUserStocks] = useState([]);
  const [tradeAccounts, setTradeAccounts] = useState([]);
  const [selectedStock, setSelectedStock] = useState("");
  const [quantity, setQuantity] = useState("");
  const [actionType, setActionType] = useState("buy");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [expectedGainLoss, setExpectedGainLoss] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [pendingSell, setPendingSell] = useState(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [pendingBuy, setPendingBuy] = useState(null);
  const [buyCost, setBuyCost] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!betaId) return;
 
    const fetchData = async () => {
      try {
        const [stockRes, userStockRes, tradeAccountRes] = await Promise.all([
          axios.get("http://localhost:8080/api/admin/stocks"),
          axios.get(`http://localhost:8080/api/user-stocks/${betaId}`),
          axios.get(`http://localhost:8080/api/trade-accounts/${betaId}`),
        ]);
        setAvailableStocks(stockRes.data);
        setUserStocks(userStockRes.data);
        setTradeAccounts(tradeAccountRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load data.");
      }
    };
 
    fetchData();
  }, [betaId]);
  const fetchTransactionHistory = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/user-stock-transactions/${betaId}/transactions`);
      setTransactions(res.data);
      setShowHistory(true);
    } catch (err) {
      console.error("Error fetching history:", err);
      toast.error("Failed to load transaction history.");
    }
  };
  
  const validateTrade = () => {
    const qty = parseInt(quantity);
    if (!selectedStock || !qty || qty <= 0 || !selectedAccount) {
      toast.error("Please select stock, enter valid quantity, and select an account.");
      return false;
    }
 
    const selectedStockDetails = availableStocks.find(
      (stock) => stock.companyName === selectedStock
    );
    const selectedAccountDetails = tradeAccounts.find(
      (acc) => acc.accountNumber === selectedAccount
    );
 
    if (!selectedStockDetails || !selectedAccountDetails) {
      toast.error("Invalid stock or account selected.");
      return false;
    }
 
    if (actionType === "buy") {
      const totalCost = selectedStockDetails.currentPrice * qty;
      if (qty > selectedStockDetails.availableStocks) {
        toast.error("Not enough stocks available to buy.");
        return false;
      }
      if (selectedAccountDetails.balance < totalCost) {
        toast.error("Insufficient balance in selected account.");
        return false;
      }
      setBuyCost(totalCost);
      setPendingBuy({ stock: selectedStock, quantity: qty, account: selectedAccount });
      setShowBuyModal(true);
      return false; // wait for confirmation
    }
 
    if (actionType === "sell") {
      const matchingHoldings = userStocks.filter(
        (stock) => stock.stockName === selectedStock
      );
      const totalOwnedQuantity = matchingHoldings.reduce(
        (sum, stock) => sum + stock.quantity,
        0
      );
 
      if (totalOwnedQuantity < qty) {
        toast.error("You don't have enough quantity to sell.");
        return false;
      }
 
      const totalPurchaseValue = matchingHoldings.reduce(
        (sum, stock) => sum + stock.purchaseValue,
        0
      );
      const weightedAvgPrice = totalPurchaseValue / totalOwnedQuantity;
      const currentPrice = selectedStockDetails.currentValue;
      const sellValue = qty * currentPrice;
      const costBasis = qty * weightedAvgPrice;
      const gainLoss = sellValue - costBasis;
 
      setExpectedGainLoss(gainLoss);
      setPendingSell({ stock: selectedStock, quantity: qty, account: selectedAccount });
      setShowModal(true);
      return false;
    }
 
    return false;
  };
  const confirmBuy = async () => {
    setShowBuyModal(false);
    if (pendingBuy) {
      await handleTrade(pendingBuy);
    }
  };
 
 
  const handleTrade = async (overrideDetails = null) => {
    const stockName = overrideDetails?.stock || selectedStock;
    const qty = overrideDetails?.quantity || parseInt(quantity);
    const account = overrideDetails?.account || selectedAccount;
 
    try {
      await axios.post(
        `http://localhost:8080/api/user-stocks/${betaId}/${actionType}`,
        null,
        {
          params: {
            stockName,
            quantity: qty,
            accountNumber: account,
          },
        }
      );
 
      toast.success(`${actionType === "buy" ? "Buy" : "Sell"} transaction successful!`);
      setQuantity("");
      setSelectedStock("");
      setSelectedAccount("");
      setPendingSell(null);
 
      // Refresh data
      const [stockRes, userStockRes, tradeAccountRes] = await Promise.all([
        axios.get("http://localhost:8080/api/admin/stocks"),
        axios.get(`http://localhost:8080/api/user-stocks/${betaId}`),
        axios.get(`http://localhost:8080/api/trade-accounts/${betaId}`),
      ]);
      setAvailableStocks(stockRes.data);
      setUserStocks(userStockRes.data);
      setTradeAccounts(tradeAccountRes.data);
    } catch (err) {
      console.error("Trade error:", err);
      toast.error("Transaction failed. Please try again.");
    }
  };
 
  const confirmSell = async () => {
    setShowModal(false);
    if (pendingSell) {
      await handleTrade(pendingSell);
    }
  };
 
  return (
    <div className="rebalancing-tab">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>Rebalancing - Buy / Sell Stocks</h2>
      <button onClick={fetchTransactionHistory} className="history-button">
        View Transaction History
      </button>

      <div className="form-row">
        <select value={selectedStock} onChange={(e) => setSelectedStock(e.target.value)}>
          <option value="">Select Stock</option>
          {availableStocks.map((stock) => (
            <option key={stock.id} value={stock.companyName}>
              {stock.companyName} - ${stock.currentPrice} (Available: {stock.availableStocks})
            </option>
          ))}
        </select>
 
        <select value={actionType} onChange={(e) => setActionType(e.target.value)}>
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
 
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
 
        <select value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)}>
          <option value="">Select Account</option>
          {tradeAccounts.map((account, idx) => (
            <option key={idx} value={account.accountNumber}>
              {account.accountType} - {account.accountName} (${account.balance})
            </option>
          ))}
        </select>
 
        <button onClick={() => validateTrade() && handleTrade()}>Confirm</button>
      </div>
 
      <h3>Your Holdings</h3>
        <table className="accounts-table">
          <thead>
            <tr>
              <th>Stock</th>
              <th>Quantity</th>
              <th>Purchase Price/Unit</th>
              <th>Current Value</th>
              <th>Potential Gain/Loss</th>
              <th>Bought At</th>
            </tr>
          </thead>
          <tbody>
            {userStocks.map((stock, idx) => (
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
            ))}
          </tbody>
        </table>

        {/* Totals below */}
        <div className="totals-summary mt-3">
          <h4>Total Current Value: ${userStocks.reduce((sum, stock) => sum + stock.currentValue, 0).toFixed(2)}</h4>
          <h4
            style={{
              color:
                userStocks.reduce((sum, stock) => sum + stock.potentialGainLoss, 0) >= 0
                  ? "green"
                  : "red",
            }}
          >
            Total Potential Gain/Loss: $
            {userStocks
              .reduce((sum, stock) => sum + stock.potentialGainLoss, 0)
              .toFixed(2)}
          </h4>
        </div>
      {showModal && (
        <div className="confirmation-modal">
          <div className="confirmation-box">
            <h4>Confirm Sell</h4>
            <p>
              Expected {expectedGainLoss >= 0 ? "Gain" : "Loss"}:{" "}
              <strong style={{ color: expectedGainLoss >= 0 ? "green" : "red" }}>
                ${Math.abs(expectedGainLoss).toFixed(2)}
              </strong>
            </p>
            <div className="modal-buttons">
              <button onClick={confirmSell}>OK</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
        
      )}
      {showBuyModal && (
  <div className="confirmation-modal">
    <div className="confirmation-box">
      <h4>Confirm Buy</h4>
      <p>
        You are about to buy <strong>{pendingBuy.quantity}</strong> shares of{" "}
        <strong>{pendingBuy.stock}</strong> for a total of{" "}
        <strong>${buyCost.toFixed(2)}</strong>.
      </p>
      <div className="modal-buttons">
        <button onClick={confirmBuy}>OK</button>
        <button onClick={() => setShowBuyModal(false)}>Cancel</button>
      </div>
    </div>
  </div>
)}
{showHistory && (
  <div className="history-modal">
    <div className="history-box">
      <h3>Transaction History</h3>
      <button className="close-button" onClick={() => setShowHistory(false)}>Close</button>
      <table className="accounts-table">
        <thead>
          <tr>
            <th>Stock</th>
            <th>Action</th>
            <th>Quantity</th>
            <th>Value</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn, idx) => (
            <tr key={idx}>
              <td>{txn.stockName}</td>
              <td style={{ color: txn.action === 'buy' ? 'green' : 'red' }}>{txn.action.toUpperCase()}</td>
              <td>{txn.quantity}</td>
              <td>${txn.value.toFixed(2)}</td>
              <td>{new Date(txn.transactedAt).toLocaleString("en-IN")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)} 
    </div>
    
  );
}
 
export default Rebalancing;
 