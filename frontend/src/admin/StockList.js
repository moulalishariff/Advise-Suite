import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../admin/css/StockList.css';

function StockList() {
  const [stocks, setStocks] = useState([]);

  const fetchStocks = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:8080/api/admin/stocks', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setStocks(res.data);
  };

  const confirmDeleteToast = (stockId) => {
    toast.dismiss(); // Clear existing toasts

    toast(
      ({ closeToast }) => (
        <div>
          <p>Are you sure you want to delete this stock?</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
            <button
              onClick={async () => {
                await handleDeleteConfirmed(stockId);
                closeToast();
              }}
              style={{ marginRight: 10 }}
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

  const handleDeleteConfirmed = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8080/api/admin/stocks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Stock deleted successfully!');
      fetchStocks();
    } catch (error) {
      toast.error('Failed to delete stock.');
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  return (
    <div className="dashboard-container">
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
      <h1>Stocks List</h1>

      <div className="table-container">
        <table className="stock-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Type</th>
              <th>Total</th>
              <th>Available</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map(stock => (
              <tr key={stock.id}>
                <td>{stock.companyName}</td>
                <td>{stock.stockType}</td>
                <td>{stock.totalStocks}</td>
                <td>{stock.availableStocks}</td>
                <td>{stock.currentPrice}</td>
                <td>
                  <Link to={`/admin/update-stock/${stock.id}`} className="edit-link">Edit</Link>
                  <button className="delete-button" onClick={() => confirmDeleteToast(stock.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StockList;
