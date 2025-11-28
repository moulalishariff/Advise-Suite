import React, { useEffect, useRef } from "react";
import "../client/css/Profile.css";

function Profile({ name, showProfileMenu, setShowProfileMenu, handleLogout, handleManageAccountsClick }) {
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileMenu, setShowProfileMenu]);

  return (
    <div className="profile-section" ref={dropdownRef}>
      <button className="profile-icon" onClick={() => setShowProfileMenu(!showProfileMenu)}>
        {name ? name.charAt(0).toUpperCase() : "U"}
      </button>
      {showProfileMenu && (
        <div className="profile-dropdown">
          <p>{name}</p>
          <button className="manage-accounts-btn" onClick={handleManageAccountsClick}>
            Manage Accounts
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;
