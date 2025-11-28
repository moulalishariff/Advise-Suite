import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./login_register/Register";
import Login from "./login_register/Login";
import ForgotPassword from "./login_register/ForgotPassword";
import ClientDashboard from "./client/ClientDashboard";
import ClientAccess from "./consultant/ClientAccess";
import ConsultantDashboard from "./consultant/ConsultantDashboard";
import AdminDashboard from "./admin/AdminDashboard";
import AddStock from "./admin/AddStock";
import StockList from "./admin/StockList";
import UpdateStock from "./admin/UpdateStock";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/client-dashboard" element={<ClientDashboard />} />
          <Route path="/client-access" element={<ClientAccess />} />
          <Route path="/consultant-dashboard/:betaId" element={<ConsultantDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/add-stock" element={<AddStock />} />
          <Route path="/admin/stocks" element={<StockList />} />
          <Route path="/admin/update-stock/:id" element={<UpdateStock />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
