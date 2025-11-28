import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../consultant/css/ClientAccess.css";

const ClientAccess = () => {
  const [clientBetaId, setClientBetaId] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!clientBetaId.trim()) {
      toast.error("Please enter a valid Client BetaId.", { position: "top-center" });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:8080/api/auth/${clientBetaId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { role } = res.data;

      if (role === "CLIENT") {
        navigate(`/consultant-dashboard/${clientBetaId}`);
      } else {
        toast.error("Only client BetaIds are allowed.", { position: "top-center" });
      }
    } catch (err) {
      toast.error("Client BetaId not found.", { position: "top-center" });
    }
  };

  return (
    <div className="client-access-container">
      <ToastContainer />
      <form className="client-access-form" onSubmit={handleSubmit}>
        <h2>Access Client Dashboard</h2>

        <input
          type="text"
          name="clientBetaId"
          placeholder="Enter Client BetaId"
          value={clientBetaId}
          onChange={(e) => setClientBetaId(e.target.value)}
          required
        />

        <button type="submit">Go to Client Dashboard</button>
      </form>
    </div>
  );
};

export default ClientAccess;
