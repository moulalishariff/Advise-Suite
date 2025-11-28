import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../admin/css/AddStock.css';

function AddStock() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    companyName: '',
    totalStocks: '',
    availableStocks: '',
    currentPrice: '',
    stockType: 'NATIONAL'
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleConfirmedSubmit = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      await axios.post('http://localhost:8080/api/admin/stocks', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Stock added successfully!');
      setTimeout(() => navigate('/admin/dashboard'), 1500);
    } catch (err) {
      toast.error('Failed to add stock. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const showConfirmationToast = () => {
    toast.dismiss(); // Close any existing toast

    toast(
      ({ closeToast }) => (
        <div>
          <p>
            The company name contains only digits or special characters.<br />
            Are you sure it's correct?
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <button
              onClick={() => {
                closeToast();
                handleConfirmedSubmit();
              }}
              style={{ marginRight: '10px' }}
            >
              Yes
            </button>
            <button onClick={closeToast}>No</button>
          </div>
        </div>
      ),
      {
        position: 'top-center',
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { companyName } = form;
    const isOnlyDigits = /^\d+$/.test(companyName);
    const isOnlySpecialChars = /^[^A-Za-z0-9]+$/.test(companyName);

    if (isOnlyDigits || isOnlySpecialChars) {
      showConfirmationToast();
    } else {
      handleConfirmedSubmit();
    }
  };

  return (
    <div className="dashboard-containers">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
      <h1>Add New Stock</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          value={form.companyName}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="totalStocks"
          placeholder="Total Stocks"
          value={form.totalStocks}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="availableStocks"
          placeholder="Available Stocks"
          value={form.availableStocks}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="currentPrice"
          placeholder="Current Price"
          value={form.currentPrice}
          onChange={handleChange}
          required
        />
        <select
          name="stockType"
          value={form.stockType}
          onChange={handleChange}
        >
          <option value="NATIONAL">National</option>
          <option value="INTERNATIONAL">International</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Stock'}
        </button>
      </form>
    </div>
  );
}

export default AddStock;
