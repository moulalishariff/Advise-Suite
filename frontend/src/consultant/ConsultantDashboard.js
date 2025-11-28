// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Home from "../client/Home";
// import ConPortfolioManagement from "../consultant/ConPortfolioManagement";
// import ConPortfolioAnalysis from "../consultant/ConPortfolioAnalysis";
// import ConRebalancing from "../consultant/ConRebalancing";
// import "../consultant/css/ConsultantDashboard.css";

// function ConsultantDashboard() {
//   const { betaId } = useParams();
//   const [activeTab, setActiveTab] = useState("home");
//   const navigate = useNavigate();

//   const confirmToast = (message, onConfirm) => {
//     toast(
//       ({ closeToast }) => (
//         <div>
//           <p>{message}</p>
//           <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
//             <button
//               onClick={() => {
//                 closeToast();
//                 onConfirm();
//               }}
//               style={{ backgroundColor: "#28a745", color: "white", border: "none", padding: "10px 20px" }}
//             >
//               Yes
//             </button>
//             <button
//               onClick={closeToast}
//               style={{ backgroundColor: "#dc3545", color: "white", border: "none", padding: "10px 20px" }}
//             >
//               No
//             </button>
//           </div>
//         </div>
//       ),
//       { position: "top-center", autoClose: false }
//     );
//   };

//   const handleChangeClient = () => {
//     confirmToast("Switch to another client?", () => {
//       toast.success("Redirecting to Client Access...", { position: "top-center" });
//       setTimeout(() => navigate("/client-access"), 1500);
//     });
//   };

//   const handleLogout = () => {
//     confirmToast("Are you sure you want to logout?", () => {
//       localStorage.clear();
//       toast.info("Logging out...", { position: "top-center" });
//       setTimeout(() => navigate("/"), 1500);
//     });
//   };

//   return (
//     <div className="dashboard-page">
//       <ToastContainer />
//       <header className="dashboard-header">
//         <h1>Advice Suite - Consultant View</h1>
//         <div className="dashboard-actions">
//           <button onClick={handleChangeClient}>Change Client</button>
//           <button onClick={handleLogout}>Logout</button>
//         </div>
//       </header>

//       <nav className="dashboard-tabs">
//         <button className={activeTab === "home" ? "active-tab" : ""} onClick={() => setActiveTab("home")}>
//           Home
//         </button>
//         <button
//           className={activeTab === "portfolio-management" ? "active-tab" : ""}
//           onClick={() => setActiveTab("portfolio-management")}
//         >
//           Portfolio Management
//         </button>
//         <button
//           className={activeTab === "portfolio-analysis" ? "active-tab" : ""}
//           onClick={() => setActiveTab("portfolio-analysis")}
//         >
//           Portfolio Analysis
//         </button>
//         <button
//           className={activeTab === "rebalancing" ? "active-tab" : ""}
//           onClick={() => setActiveTab("rebalancing")}
//         >
//           Rebalancing
//         </button>
//       </nav>

//       <main className="dashboard-content">
//         {activeTab === "home" && <Home betaId={betaId} />}
//         {activeTab === "portfolio-management" && <ConPortfolioManagement betaId={betaId} />}
//         {activeTab === "portfolio-analysis" && <ConPortfolioAnalysis betaId={betaId} />}
//         {activeTab === "rebalancing" && <ConRebalancing betaId={betaId} />}
//       </main>
//     </div>
//   );
// }

// export default ConsultantDashboard;

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "../client/Home";
import ConPortfolioManagement from "../consultant/ConPortfolioManagement";
import ConPortfolioAnalysis from "../consultant/ConPortfolioAnalysis";
import ConRebalancing from "../consultant/ConRebalancing";
import Notifications from "../consultant/Notifications";  // Import the Notifications component
import "../consultant/css/ConsultantDashboard.css";

function ConsultantDashboard() {
  const { betaId } = useParams();
  const [activeTab, setActiveTab] = useState("home");
  const navigate = useNavigate();

  const confirmToast = (message, onConfirm) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>{message}</p>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button
              onClick={() => {
                closeToast();
                onConfirm();
              }}
              style={{ backgroundColor: "#28a745", color: "white", border: "none", padding: "10px 20px" }}
            >
              Yes
            </button>
            <button
              onClick={closeToast}
              style={{ backgroundColor: "#dc3545", color: "white", border: "none", padding: "10px 20px" }}
            >
              No
            </button>
          </div>
        </div>
      ),
      { position: "top-center", autoClose: false }
    );
  };

  const handleChangeClient = () => {
    confirmToast("Switch to another client?", () => {
      toast.success("Redirecting to Client Access...", { position: "top-center" });
      setTimeout(() => navigate("/client-access"), 1500);
    });
  };

  const handleLogout = () => {
    confirmToast("Are you sure you want to logout?", () => {
      localStorage.clear();
      toast.info("Logging out...", { position: "top-center" });
      setTimeout(() => navigate("/"), 1500);
    });
  };

  return (
    <div className="dashboard-page">
      <ToastContainer />
      <header className="dashboard-header">
        <h1>Advice Suite - Consultant View</h1>
        <div className="dashboard-actions">
          <button onClick={handleChangeClient}>Change Client</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <nav className="dashboard-tabs">
        <button className={activeTab === "home" ? "active-tab" : ""} onClick={() => setActiveTab("home")}>
          Home
        </button>
        <button
          className={activeTab === "portfolio-management" ? "active-tab" : ""}
          onClick={() => setActiveTab("portfolio-management")}
        >
          Portfolio Management
        </button>
        <button
          className={activeTab === "portfolio-analysis" ? "active-tab" : ""}
          onClick={() => setActiveTab("portfolio-analysis")}
        >
          Portfolio Analysis
        </button>
        <button
          className={activeTab === "rebalancing" ? "active-tab" : ""}
          onClick={() => setActiveTab("rebalancing")}
        >
          Rebalancing
        </button>
        {/* <button
          className={activeTab === "notifications" ? "active-tab" : ""}
          onClick={() => setActiveTab("notifications")}
        >
          Notifications
        </button> */}
      </nav>

      <main className="dashboard-content">
        {activeTab === "home" && <Home betaId={betaId} />}
        {activeTab === "portfolio-management" && <ConPortfolioManagement betaId={betaId} />}
        {activeTab === "portfolio-analysis" && <ConPortfolioAnalysis betaId={betaId} />}
        {activeTab === "rebalancing" && <ConRebalancing betaId={betaId} />}
        {activeTab === "notifications" && <Notifications betaId={betaId} />}  {/* Show Notifications */}
      </main>
    </div>
  );
}

export default ConsultantDashboard;
