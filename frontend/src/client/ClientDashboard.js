import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Home from "./Home";
import PortfolioManagement from "./PortfolioManagement";
import PortfolioAnalysis from "./PortfolioAnalysis";
import Rebalancing from "./Rebalancing";
import ManageAccounts from "./ManageAccounts";
import Profile from "./Profile";
import "../client/css/ClientDashboard.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ClientDashboard() {
  const [activeTab, setActiveTab] = useState("home");
  const [accounts, setAccounts] = useState([]);
  const [newAccount, setNewAccount] = useState({ accountName: "", accountType: "" });
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionType, setTransactionType] = useState("deposit");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showTransactionFields, setShowTransactionFields] = useState(false);
  const [transactionButtonText, setTransactionButtonText] = useState("Deposit");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [editedAccount, setEditedAccount] = useState({ accountName: "", accountType: "" });

  const name = localStorage.getItem("name");
  const betaId = localStorage.getItem("betaId");

  const ACCOUNT_TYPES = ["BROKERAGE", "ROLLOVER_IRA", "SEP_IRA", "HSA", "IRA"];

  const fetchAccounts = useCallback(async () => {
    if (!betaId) return;
    try {
      const res = await axios.get(`http://localhost:8080/api/trade-accounts/${betaId}`);
      setAccounts(res.data);
    } catch (err) {
      console.error("Error fetching accounts:", err);
    }
  }, [betaId]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleCreateAccount = async () => {
    const { accountName, accountType } = newAccount;
    if (!accountName || !accountType) {
      return;
    }
    try {
      await axios.post(`http://localhost:8080/api/trade-accounts/${betaId}`, {
        accountName,
        accountType,
      });
      setNewAccount({ accountName: "", accountType: "" });
      setShowCreateForm(false);
      fetchAccounts();
    } catch (error) {
      console.error("Create account error:", error);
    }
  };

  const handleDeposit = async () => {
    const amount = parseFloat(transactionAmount);
    if (!selectedAccount || !amount || amount <= 0) {
      return;
    }
    try {
      await axios.post(
        `http://localhost:8080/api/trade-accounts/${betaId}/${selectedAccount}/deposit`,
        null,
        { params: { amount } }
      );
      setTransactionAmount("");
      fetchAccounts();
    } catch (error) {
      console.error("Deposit error:", error);
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(transactionAmount);
    if (!selectedAccount || !amount || amount <= 0) {
      return;
    }
    try {
      await axios.post(
        `http://localhost:8080/api/trade-accounts/${betaId}/${selectedAccount}/withdraw`,
        null,
        { params: { amount } }
      );
      setTransactionAmount("");
      fetchAccounts();
    } catch (error) {
      console.error("Withdraw error:", error);
    }
  };

  const handleUpdateAccount = async (accountNumber) => {
    try {
      await axios.put(`http://localhost:8080/api/trade-accounts/${betaId}/${accountNumber}`, editedAccount);
      setEditingAccount(null);
      fetchAccounts();
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleDeleteAccount = async (accountNumber) => {
    try {
      await axios.delete(`http://localhost:8080/api/trade-accounts/${betaId}/${accountNumber}`);
      fetchAccounts();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const startEditing = (account) => {
    setEditingAccount(account.accountNumber);
    setEditedAccount({
      accountName: account.accountName,
      accountType: account.accountType,
    });
  };

  const cancelEditing = () => {
    setEditingAccount(null);
    setEditedAccount({ accountName: "", accountType: "" });
  };

  const confirmLogoutToast = () => {
    toast.info(
      ({ closeToast }) => (
        <div style={{ textAlign: "center" }}>
          <p>Are you sure you want to logout?</p>
          <button
            onClick={() => {
              toast.dismiss();
              localStorage.clear();
              toast.success("Logout successful!", { position: "top-center" });
              setTimeout(() => {
                window.location.href = "/";
              }, 1500);
            }}
            style={{ marginRight: "10px", backgroundColor: "#d9534f", color: "#fff", border: "none", padding: "5px 10px", cursor: "pointer" }}
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            style={{ backgroundColor: "#5bc0de", color: "#fff", border: "none", padding: "5px 10px", cursor: "pointer" }}
          >
            No
          </button>
        </div>
      ),
      { position: "top-center", autoClose: false, closeOnClick: false, draggable: false }
    );
  };

  return (
    <div className="dashboard-page">
      <ToastContainer />
      <header className="dashboard-header">
        <h1>Advice Suite</h1>
        <Profile
          name={name}
          showProfileMenu={showProfileMenu}
          setShowProfileMenu={setShowProfileMenu}
          handleLogout={confirmLogoutToast}
          handleManageAccountsClick={() => setActiveTab("trade-accounts")}
        />
      </header>

      <nav className="dashboard-tabs">
        <button className={activeTab === "home" ? "active-tab" : ""} onClick={() => setActiveTab("home")}>Home</button>
        <button className={activeTab === "portfolio-management" ? "active-tab" : ""} onClick={() => setActiveTab("portfolio-management")}>Portfolio Management</button>
        <button className={activeTab === "portfolio-analysis" ? "active-tab" : ""} onClick={() => setActiveTab("portfolio-analysis")}>Portfolio Analysis</button>
        <button className={activeTab === "rebalancing" ? "active-tab" : ""} onClick={() => setActiveTab("rebalancing")}>Rebalancing</button>
      </nav>

      <main className="dashboard-content">
        {activeTab === "home" && <Home />}
        {activeTab === "portfolio-management" && <PortfolioManagement betaId={betaId} />}
        {activeTab === "portfolio-analysis" && <PortfolioAnalysis betaId={betaId}/>}
        {activeTab === "rebalancing" && <Rebalancing betaId={betaId}/>}
        {activeTab === "trade-accounts" && (
          <ManageAccounts
            accounts={accounts}
            showCreateForm={showCreateForm}
            setShowCreateForm={setShowCreateForm}
            showTransactionFields={showTransactionFields}
            setShowTransactionFields={setShowTransactionFields}
            transactionButtonText={transactionButtonText}
            setTransactionButtonText={setTransactionButtonText}
            handleCreateAccount={handleCreateAccount}
            newAccount={newAccount}
            setNewAccount={setNewAccount}
            ACCOUNT_TYPES={ACCOUNT_TYPES}
            selectedAccount={selectedAccount}
            setSelectedAccount={setSelectedAccount}
            transactionAmount={transactionAmount}
            setTransactionAmount={setTransactionAmount}
            transactionType={transactionType}
            setTransactionType={setTransactionType}
            handleDepositWithdraw={
              transactionType === "deposit" ? handleDeposit : handleWithdraw
            }
            editingAccount={editingAccount}
            editedAccount={editedAccount}
            setEditedAccount={setEditedAccount}
            startEditing={startEditing}
            cancelEditing={cancelEditing}
            handleUpdateAccount={handleUpdateAccount}
            handleDeleteAccount={handleDeleteAccount}
          />
        )}
      </main>
    </div>
  );
}

export default ClientDashboard;
