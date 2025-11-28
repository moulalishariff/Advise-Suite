import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../login_register/css/Login.css";
 
const Login = () => {
  const [formData, setFormData] = useState({
    betaId: "",
    password: "",
  });
 
  const navigate = useNavigate();
 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    const { betaId, password } = formData;
 
    if (!betaId || !password) {
      toast.error("Please fill in both fields.", { position: "top-center" });
      return;
    }
 
    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        betaId,
        password,
      });
 
      const { role, token,name } = response.data;
      localStorage.setItem("name", name);
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("betaId", betaId);
 
      toast.success("Login successful!", { position: "top-center", autoClose: 1500 });
 
      setTimeout(() => {
        if (role === "ADMIN") {
          navigate("/admin/dashboard");
        } else if (role === "CONSULTANT") {
          navigate("/client-access");
        } else if (role === "CLIENT") {
          navigate("/client-dashboard");
        } else {
          navigate("/");
        }
      }, 1800);
 
    } catch (err) {
      toast.error(err.response?.data || "Login failed.", { position: "top-center" });
    }
  };
 
  return (
    <div className="login-container">
      <ToastContainer />
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
 
        <input
          type="text"
          name="betaId"
          placeholder="Beta ID"
          value={formData.betaId}
          onChange={handleChange}
          required
        />
 
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
 
        <button type="submit">Login</button>
        <p className="forgot-password-link">
          <a href="/forgot-password">Forgot Password?</a>
        </p>
        <p className="register-link">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </form>
    </div>
  );
};
 
export default Login;