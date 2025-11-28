import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import '../login_register/css/ForgotPassword.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ForgotPassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    betaId: '',
    phone: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
const [error, setError] = useState('');
  const passwordPattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9]).{8,}$";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, betaId, phone, newPassword, confirmPassword } = form;

    if (!email || !betaId || !phone || !newPassword || !confirmPassword) {
      setError("Email, Beta ID & Phone number must match.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const isPasswordValid = new RegExp(passwordPattern).test(newPassword);
    if (!isPasswordValid) {
      setError("Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.");
      return;
    }

    try {
      const res = await axios.post('http://localhost:8080/api/auth/forgot-password', {
        email,
        betaId,
        phone,
        newPassword
      });

      setMessage(res.data);
      setForm({
        email: '',
        betaId: '',
        phone: '',
        newPassword: '',
        confirmPassword: ''
      });

      toast.success('Password changed successfully! Redirecting to login...', {
        position: 'top-center',
        autoClose: 2000
      });

      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (err) {
      if (err.response?.status === 404) {
        setError('Invalid email, beta ID, or phone number');
      } else {
        setError('Invalid email, beta ID, or phone number');
      }
    }
  };

  return (
    <div className="forgot-container">
      <h2>Forgot Password</h2>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Beta ID:</label>
          <input
            type="text"
            name="betaId"
            value={form.betaId}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            pattern="[0-9]{10}"
            title="Phone number must be 10 digits"
          />
        </div>
        <div className="form-group">
          <label>New Password:</label>
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={form.newPassword}
            onChange={handleChange}
            required
            pattern={passwordPattern}
            title="Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character"
          />
        </div>
        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            pattern={passwordPattern}
            title="Passwords must match and follow the required pattern"
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>

      <div className="forgot-links">
        <Link to="/">← Back to Login</Link>
      </div>
    </div>
  );
}

export default ForgotPassword;
