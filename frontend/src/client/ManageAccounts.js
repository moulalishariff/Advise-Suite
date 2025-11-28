import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../client/css/ManageAccounts.css";
 
function ManageAccounts({
  accounts,
  showCreateForm,
  setShowCreateForm,
  showTransactionFields,
  setShowTransactionFields,
  transactionButtonText,
  setTransactionButtonText,
  handleCreateAccount,
  newAccount,
  setNewAccount,
  selectedAccount,
  setSelectedAccount,
  transactionAmount,
  setTransactionAmount,
  transactionType,
  setTransactionType,
  handleDepositWithdraw,
  editingAccount,
  editedAccount,
  setEditedAccount,
  startEditing,
  cancelEditing,
  handleUpdateAccount,
  handleDeleteAccount,
}) {
  const [isProcessing, setIsProcessing] = useState(false);
 
  const onCreateAccount = () => {
    toast.dismiss("create-account-toast");
 
  const nameRegex = /^[A-Za-z][A-Za-z0-9]{3,}$/;

if (!nameRegex.test(newAccount.accountName)) {
  toast.error(
    "Invalid Account name provided.",
    {
      position: "top-center",
      toastId: "create-account-toast",
    }
  );
  return;
}
 
    const duplicate = accounts.find(
      (a) =>
        a.accountName === newAccount.accountName &&
        a.accountType === newAccount.accountType
    );
 
    if (duplicate) {
      toast.error("An account with this name and type already exists.", {
        position: "top-center",
        toastId: "create-account-toast",
      });
      return;
    }
 
    handleCreateAccount();
    toast.success("Account created successfully!", {
      position: "top-center",
      toastId: "create-account-toast",
    });
  };
 
  const onDepositWithdraw = () => {
    toast.dismiss("transaction-toast");
 
    if (
      !selectedAccount ||
      !transactionType ||
      !transactionAmount ||
      transactionAmount <= 0
    ) {
      toast.error("Please complete all transaction fields with valid data.", {
        position: "top-center",
        toastId: "transaction-toast",
      });
      return;
    }
 
    const account = accounts.find(
      (acc) => acc.accountNumber === selectedAccount
    );
 
    if (!account) {
      toast.error("Selected account not found.", {
        position: "top-center",
        toastId: "transaction-toast",
      });
      return;
    }
 
    if (
      transactionType === "withdraw" &&
      parseFloat(transactionAmount) > account.balance
    ) {
      toast.error("Insufficient funds for withdrawal.", {
        position: "top-center",
        toastId: "transaction-toast",
      });
      return;
    }
 
    setIsProcessing(true);
 
   
    handleDepositWithdraw();
 
    toast.success(
      `${transactionType === "deposit" ? "Deposit" : "Withdrawal"} successful!`,
      {
        position: "top-center",
        toastId: "transaction-toast",
      }
    );
 
    setTimeout(() => setIsProcessing(false), 1000);
  };
 
  const onUpdateAccount = (accountNumber) => {
    toast.dismiss("update-account-toast");
    const nameRegex = /^(?=.*[A-Za-z])[A-Za-z0-9]+$/;
    if (!nameRegex.test(editedAccount.accountName)) {
      toast.error(
        "Account name should not contain special characters.",
        {
          position: "top-center",
          toastId: "update-account-toast",
        }
      );
      return;
    }
    
 
    handleUpdateAccount(accountNumber);
    toast.success("Account updated successfully!", {
      position: "top-center",
      toastId: "update-account-toast",
    });
  };
 
  const onDeleteAccount = (accountNumber) => {
    toast.dismiss("delete-account-toast");
 
    toast.info(
      <div>
        <p>Are you sure you want to delete this account?</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <button
            onClick={() => {
              handleDeleteAccount(accountNumber);
              toast.dismiss("delete-account-toast");
              toast.success("Account deleted successfully!", {
                position: "top-center",
                toastId: "delete-account-toast",
              });
            }}
            style={{
              padding: "5px 10px",
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss("delete-account-toast")}
            style={{
              padding: "5px 10px",
              backgroundColor: "#6c757d",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            No
          </button>
        </div>
      </div>,
      { position: "top-center", autoClose: false, toastId: "delete-account-toast" }
    );
  };
 
  return (
    <div>
      <div className="account-header">
        <h2>Your Trade Accounts</h2>
        <div>
          <button onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? "Close" : "Create Account"}
          </button>
          <button
            onClick={() => {
              setShowTransactionFields(!showTransactionFields);
              setTransactionButtonText(
                showTransactionFields ? "Deposit/Withdraw" : "Close"
              );
            }}
          >
            {transactionButtonText}
          </button>
        </div>
      </div>
 
      {showCreateForm && (
        <div className="form-row">
          <div className="form-field">
            <input
              type="text"
              placeholder="Account Name"
              value={newAccount.accountName}
              onChange={(e) =>
                setNewAccount({ ...newAccount, accountName: e.target.value })
              }
            />
          </div>
          <div className="form-field">
            <select
              value={newAccount.accountType}
              onChange={(e) =>
                setNewAccount({ ...newAccount, accountType: e.target.value })
              }
            >
              <option value="">Select Type</option>
              <option value="BROKERAGE">BROKERAGE</option>
              <option value="IRA">IRA</option>
              <option value="ROLLOVER_IRA">ROLLOVER_IRA</option>
              <option value="ROTH_IRA">ROTH_IRA</option>
            </select>
          </div>
          <div className="form-field">
            <button onClick={onCreateAccount}>Save</button>
          </div>
        </div>
      )}
 
      {showTransactionFields && (
        <div className="form-row">
          <div className="form-field">
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
            >
              <option value="">Select Account</option>
              {accounts.map((a) => (
                <option key={a.accountNumber} value={a.accountNumber}>
                  {a.accountName || "(Unnamed)"} ({a.accountType || "N/A"})
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
            >
              <option value="">Select Type</option>
              <option value="deposit">Deposit</option>
              <option value="withdraw">Withdraw</option>
            </select>
          </div>
          <div className="form-field">
            <input
              type="number"
              placeholder="Amount"
              value={transactionAmount}
              onChange={(e) => setTransactionAmount(e.target.value)}
            />
          </div>
          <div className="form-field">
            <button
              className="confirm-btn"
              onClick={onDepositWithdraw}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Confirm"}
            </button>
          </div>
        </div>
      )}
 
      <table className="accounts-table">
        <thead>
          <tr>
            <th>Account Name</th>
            <th>Type</th>
            <th>Balance</th>
            <th>Tax Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((acc) => (
            <tr key={acc.accountNumber}>
              {editingAccount === acc.accountNumber ? (
                <>
                  <td>
                    <input
                      value={editedAccount.accountName}
                      onChange={(e) =>
                        setEditedAccount({
                          ...editedAccount,
                          accountName: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>
                    <select
                      value={editedAccount.accountType}
                      onChange={(e) =>
                        setEditedAccount({
                          ...editedAccount,
                          accountType: e.target.value,
                        })
                      }
                    >
                      <option value="BROKERAGE">BROKERAGE</option>
                      <option value="IRA">IRA</option>
                      <option value="ROLLOVER_IRA">ROLLOVER_IRA</option>
                      <option value="ROTH_IRA">ROTH_IRA</option>
                    </select>
                  </td>
                  <td>${acc.balance?.toFixed(2)}</td>
                  <td>{acc.taxStatus || "N/A"}</td>
                  <td>
                    <button
                      className="save-btn"
                      onClick={() => onUpdateAccount(acc.accountNumber)}
                    >
                      Save
                    </button>
                    <button onClick={cancelEditing}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{acc.accountName || "N/A"}</td>
                  <td>{acc.accountType || "N/A"}</td>
                  <td>${acc.balance?.toFixed(2) || "0.00"}</td>
                  <td>{acc.taxStatus || "N/A"}</td>
                  <td>
                    <button onClick={() => startEditing(acc)}>Edit</button>
                    <button onClick={() => onDeleteAccount(acc.accountNumber)}>
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
 
export default ManageAccounts;
 
 