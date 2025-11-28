import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../admin/css/UpdateStock.css';

function UpdateStock() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    companyName: '',
    totalStocks: '',
    availableStocks: '',
    currentPrice: '',
    stockType: 'NATIONAL'
  });

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:8080/api/admin/stocks/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setForm(res.data);
      } catch (error) {
        toast.error('Failed to fetch stock details');
      }
    };
    fetchStock();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8080/api/admin/stocks/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Stock updated successfully!');
      setTimeout(() => navigate('/admin/dashboard'), 2000);
    } catch (error) {
      toast.error('Failed to update stock');
    }
  };

  return (
    <div className="dashboard-containers">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
      
      <h1>Update Stock</h1>

      <form className="form-container" onSubmit={handleSubmit}>
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

        <select name="stockType" value={form.stockType} onChange={handleChange}>
          <option value="NATIONAL">National</option>
          <option value="INTERNATIONAL">International</option>
        </select>

        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default UpdateStock;
