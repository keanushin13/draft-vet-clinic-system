import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/StaffProfile.css";
import Modal from "../security/Modal"; // adjust path if needed
import API from "../../api/api"; // your Axios instance

// ASSETS
import appointmentIcon from "../../assets/Appointment_Icon.png";
import bellIcon from "../../assets/Bell_Icon.png";
import dashboardIcon from "../../assets/Dashboard_Icon.png";
import inventoryIcon from "../../assets/Inventory_Icon.png";
import activityLogIcon from "../../assets/Medical_Icon.png";
import messageIcon from "../../assets/Message_Icon.png";
import pawLogo from "../../assets/paw.png";
import payHistoryIcon from "../../assets/payment_icon.png";
import petsProfileIcon from "../../assets/Pets_Icon.png";
import userIcon from "../../assets/User_Icon.png";
import userManagementIcon from "../../assets/UserManagement_Icon.png";

const StaffProfile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [showResetModal, setShowResetModal] = useState(false); // modal to enter email
  const [resetEmail, setResetEmail] = useState(""); // email typed by user
  const [loading, setLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState(""); // message for success/error

  useEffect(() => {
    if (!user || user.role !== "staff") {
      navigate("/login");
    }
  }, [navigate, user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleResetPassword = async () => {
    if (!resetEmail) {
      setResetMessage("Please enter your email.");
      return;
    }

    setLoading(true);
    setResetMessage("");

    try {
      const res = await API.post("/users/forgot-password", { email: resetEmail });
      setResetMessage(res.data.message || "A reset link has been sent to your email.");
      setResetEmail("");
    } catch (err) {
      setResetMessage(err.response?.data?.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={pawLogo} alt="Logo" />
          <span>PawCruz</span>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-item" onClick={() => navigate("/staff")}>
            <img src={dashboardIcon} alt="" /><span>Dashboard</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/staff-appointments")}>
            <img src={appointmentIcon} alt="" /><span>Appointment</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/staff-users")}>
            <img src={userManagementIcon} alt="" /><span>User Management</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/staff-pets")}>
            <img src={petsProfileIcon} alt="" /><span>Pets Profile</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/staff-messages")}>
            <img src={messageIcon} alt="" /><span>Messages</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/staff-inventory")}>
            <img src={inventoryIcon} alt="" /><span>Inventory</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/staff-payments")}>
            <img src={payHistoryIcon} alt="" /><span>Payment History</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/staff-activity")}>
            <img src={activityLogIcon} alt="" /><span>Activity Log</span>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-area">
        <header className="top-bar">
          <h2>My Profile</h2>
          <div className="top-bar-right">
            <button className="notif-btn" onClick={() => navigate("/staff-notifications")}>
              <img src={bellIcon} alt="Notif" />
            </button>
            <div className="user-profile active"><img src={userIcon} alt="Profile" /></div>
          </div>
        </header>

        <section className="content-body">
          <div className="profile-container">
            {/* PROFILE HEADER */}
            <div className="profile-header-card">
              <div className="profile-banner"></div>
              <div className="profile-info-main">
                <div className="profile-avatar-wrapper">
                  <img src={userIcon} alt="Avatar" />
                </div>
                <div className="profile-title">
                  <h3>{user?.name || "Staff Member"}</h3>
                  <p>Clinic Administrator / Staff</p>
                </div>
                <button className="edit-profile-btn">Edit Profile</button>
              </div>
            </div>

            {/* DETAILS GRID */}
            <div className="profile-details-grid">
              <div className="details-card">
                <h4>Personal Information</h4>
                <div className="info-row">
                  <label>Full Name</label>
                  <span>{user?.name || "N/A"}</span>
                </div>
                <div className="info-row">
                  <label>Email Address</label>
                  <span>{user?.email || "staff@pawcruz.com"}</span>
                </div>
                <div className="info-row">
                  <label>Phone Number</label>
                  <span>+63 912 345 6789</span>
                </div>
              </div>

              <div className="details-card">
                <h4>Account Security</h4>
                <div className="info-row">
                  <label>Role</label>
                  <span className="role-tag">Staff Access</span>
                </div>
                <div className="info-row">
                  <label>Password</label>
                  <span>••••••••••••</span>
                </div>
                <button className="change-pass-btn" onClick={() => setShowResetModal(true)}>
                  Change / Reset Password
                </button>
              </div>
            </div>

            {/* LOGOUT BUTTON */}
            <button className="logout-btn" onClick={() => setShowLogoutModal(true)}>
              Logout Account
            </button>
          </div>
        </section>

        {/* LOGOUT MODAL */}
        <Modal show={showLogoutModal} onClose={() => setShowLogoutModal(false)}>
          <h3>Confirm Logout</h3>
          <p>Are you sure you want to logout?</p>
          <div className="modal-actions">
            <button className="confirm-btn" onClick={handleLogout}>Logout</button>
            <button className="cancel-btn" onClick={() => setShowLogoutModal(false)}>Cancel</button>
          </div>
        </Modal>

        {/* RESET PASSWORD MODAL */}
        <Modal show={showResetModal} onClose={() => setShowResetModal(false)}>
          <h3>Reset Password</h3>
          <p>Enter your email to receive a password reset link:</p>
          <input
            type="email"
            placeholder="Enter your email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            className="modal-input"
          />
          {resetMessage && <p className={`reset-message ${resetMessage.includes("sent") ? "success" : "error"}`}>{resetMessage}</p>}
          <div className="modal-actions">
            <button className="confirm-btn" onClick={handleResetPassword}>
              {loading ? "Sending..." : "Send"}
            </button>
            <button className="cancel-btn" onClick={() => setShowResetModal(false)}>
              Cancel
            </button>
          </div>
        </Modal>
      </main>
    </div>
  );
};

export default StaffProfile;
