import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../admin/css/AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);

  const handleLogout = () => {
    toast.info(
      ({ closeToast }) => (
        <div>
          <p>Are you sure you want to logout?</p>
          <div className="toast-confirm-buttons">
            <button onClick={() => {
              localStorage.removeItem('token');
              toast.success('Logged out successfully!');
              closeToast();
              setTimeout(() => navigate('/'), 1500);
            }}>Yes</button>
            <button onClick={closeToast}>No</button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };
  
  const handleDelete = (id) => {
    toast.info(
      ({ closeToast }) => (
        <div>
          <p>Are you sure you want to delete this stock?</p>
          <div className="toast-confirm-buttons">
            <button onClick={async () => {
              try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:8080/api/admin/stocks/${id}`, {
                  headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Stock deleted successfully!');
                fetchStocks();
              } catch (error) {
                toast.error('Failed to delete stock');
              }
              closeToast();
            }}>Yes</button>
            <button onClick={closeToast}>No</button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };
  

  const fetchStocks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8080/api/admin/stocks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStocks(res.data);
    } catch (error) {
      toast.error('Failed to fetch stocks');
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  return (
    <div className="dashboard-container">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
      
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="dashboard-actions">
          <Link to="/admin/add-stock">
            <button className="add-stock-button">Add Stock</button>
          </Link>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </div>

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
                  <button className="delete-button" onClick={() => handleDelete(stock.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
