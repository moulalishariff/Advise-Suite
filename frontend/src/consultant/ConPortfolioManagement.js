import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./css/ConPortfolioManagement.css";

const ConPortfolioManagement = ({ betaId }) => {
  const dropdownRef = useRef(null);
  const [portfolios, setPortfolios] = useState([]);
  const [userStocks, setUserStocks] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    tradeAccount: "",
    selectedUserStockIds: [],
    showDropdown: false,
  });
  
  const [editingId, setEditingId] = useState(null);

  const fetchUserStocks = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/user-stocks/${betaId}`);
      setUserStocks(res.data);
    } catch (err) {
      toast.error("Failed to fetch user stocks.");
    }
  }, [betaId]);

  const fetchPortfolios = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/portfolios/${betaId}`);
      setPortfolios(res.data);
    } catch (err) {
      toast.error("Failed to fetch portfolios.");
    }
  }, [betaId]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setForm((prev) => ({ ...prev, showDropdown: false }));
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  useEffect(() => {
    fetchPortfolios();
    fetchUserStocks();
  }, [fetchPortfolios, fetchUserStocks]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (stockId) => {
    setForm((prev) => {
      const alreadySelected = prev.selectedUserStockIds.includes(stockId);
      const updatedIds = alreadySelected
        ? prev.selectedUserStockIds.filter((id) => id !== stockId)
        : [...prev.selectedUserStockIds, stockId];
      return { ...prev, selectedUserStockIds: updatedIds };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const nameRegex = /^(?!\d+$)[A-Za-z0-9_]+$/;
    if (!nameRegex.test(form.name)) {
      toast.error(
        "Try to give valid Portfolio name.",
        {
          position: "top-center",
          toastId: "portfolio-name-toast",
        }
      );

      return;
    }
  
    const payload = {
      name: form.name,
      description: form.description,
      tradeAccount: form.tradeAccount,
      betaId,
      selectedUserStockIds: form.selectedUserStockIds,
    };
  
    try {
      if (editingId) {
        await axios.put(`http://localhost:8080/api/portfolios/${editingId}`, payload);
        toast.success("Portfolio updated successfully");
      } else {
        await axios.post("http://localhost:8080/api/portfolios", payload);
        toast.success("Portfolio created successfully");
      }
  
      setForm({
        name: "",
        description: "",
        tradeAccount: "",
        selectedUserStockIds: [],
      });
      setEditingId(null);
      fetchPortfolios();
    } catch (err) {
      toast.error("Failed to save portfolio");
    }
  };
  

  const handleEdit = (portfolio) => {
    const selectedIds = portfolio.selectedUserStocks.map((s) => s.id);
    setForm({
      name: portfolio.name,
      description: portfolio.description,
      tradeAccount: portfolio.tradeAccount,
      selectedUserStockIds: selectedIds,
    });
    setEditingId(portfolio.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/portfolios/${id}`);
      toast.success("Portfolio deleted");
      fetchPortfolios();
    } catch (err) {
      toast.error("Failed to delete portfolio");
    }
  };

  return (
    <div className="portfolio-mgmt-container">
      <ToastContainer />
      <h2>Client Portfolios</h2>

      <form className="portfolio-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Portfolio Name"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Portfolio Description"
        />
        <input
          type="text"
          name="tradeAccount"
          value={form.tradeAccount}
          onChange={handleChange}
          placeholder="Trade Account"
          required
        />

        <h4>Select Current Holdings</h4>
        <div className="custom-multiselect" ref={dropdownRef}>
          <div
            className="multiselect-toggle"
            onClick={() =>
              setForm((prev) => ({ ...prev, showDropdown: !prev.showDropdown }))
            }
          >
            {form.selectedUserStockIds.length > 0
              ? `${form.selectedUserStockIds.length} stock(s) selected`
              : "Select Holdings"}
            <span className="dropdown-arrow">▼</span>
          </div>

          {form.showDropdown && (
            <div className="multiselect-options">
              {userStocks.map((stock) => (
                <label key={stock.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={form.selectedUserStockIds.includes(stock.id)}
                    onChange={() => handleCheckboxChange(stock.id)}
                  />
                  {stock.stockName} | Qty: {stock.quantity}, ${stock.purchaseValue}
                </label>
              ))}
            </div>
          )}
        </div>
        <button type="submit" className="submit-btn">
          {editingId ? "Update Portfolio" : "Create Portfolio"}
        </button>
      </form>

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
            <div className="portfolio-actions">
              <button onClick={() => handleEdit(p)}>Edit</button>
              <button onClick={() => handleDelete(p.id)} className="delete-btn">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConPortfolioManagement;
