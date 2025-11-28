import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../login_register/css/Register.css";
 
const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "",
    consultantKey: "",
  });
 
  const [showPassword] = useState(false);
  const [showConfirmPassword] = useState(false);
 
  const navigate = useNavigate();
 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    const { name, email, password, confirmPassword, phone, role, consultantKey } = formData;
 
    if (!name || !email || !password || !confirmPassword || !phone || !role || (role === "CONSULTANT" && !consultantKey)) {
      toast.error("Please fill in all required fields.", { position: "top-center" });
      return;
    }
 
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.", { position: "top-center" });
      return;
    }
 
    if (role === "CONSULTANT") {
      const expectedConsultantKey = "123456789012";
      if (consultantKey !== expectedConsultantKey) {
        toast.error("Invalid Consultant Key.", { position: "top-center" });
        return;
      }
    }
 
    try {
      const response = await axios.post("http://localhost:8080/api/auth/register", {
        name,
        email,
        password,
        phone,
        role,
      });
 
      toast.success(response.data, { position: "top-center", autoClose: 1500 });
 
      setTimeout(() => {
        navigate("/");
      }, 1800);
    } catch (err) {
      toast.error(err.response?.data || "Registration failed.", { position: "top-center" });
    }
  };
 
 
  return (
    <div className="register-container">
      <ToastContainer />
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
 
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          pattern="\d{10}"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <select name="role" value={formData.role} onChange={handleChange} required>
  <option value="" disabled>Select Role</option>
  <option value="CLIENT">Client</option>
  <option value="CONSULTANT">Consultant</option>
</select>
{/*
        <select name="role" value={formData.role} onChange={handleChange} required>
          <option value="CLIENT">Client</option>
          <option value="CONSULTANT">Consultant</option>
        </select> */}
 
        {formData.role === "CONSULTANT" && (
          <input
            type="text"
            name="consultantKey"
            placeholder="Enter 12-digit Consultant Key"
            value={formData.consultantKey}
            onChange={handleChange}
            required
            pattern="\d{12}"
            title="Consultant Key must be exactly 12 digits"
          />
        )}
       
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$"
            title="Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
          />
        </div>
 
        <div className="password-wrapper">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$"
          />
        </div>
 
        <button type="submit">Register</button>
 
        <p className="login-link">
          Already have an account? <a href="/">Login</a>
        </p>
      </form>
    </div>
  );
};
 
export default Register;