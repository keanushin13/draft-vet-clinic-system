import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/AdminProfile.css";
import Modal from "../security/Modal";
import API from "../../api/api"; // Axios instance

// ASSETS
import bellIcon from "../../assets/Bell_Icon.png";
import dashboardIcon from "../../assets/Dashboard_Icon.png";
import messageIcon from "../../assets/Message_Icon.png";
import pawLogo from "../../assets/paw.png";
import userIcon from "../../assets/User_Icon.png";
import userManagementIcon from "../../assets/UserManagement_Icon.png";

const AdminProfile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") {
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
          <div className="nav-item" onClick={() => navigate("/admin")}>
            <img src={dashboardIcon} alt="Dashboard" />
            <span>Dashboard</span>
          </div>
          
          <div className="nav-item" onClick={() => navigate("/admin-users")}>
            <img src={userManagementIcon} alt="Management" />
            <span>User Management</span>
          </div>

          <div className="nav-item" onClick={() => navigate("/admin-messages")}>
            <img src={messageIcon} alt="Messages" />
            <span>Messages</span>
          </div>
        </nav>
      </aside>

      {/* MAIN AREA */}
      <main className="main-area">
        <header className="top-bar">
          <h2>My Profile</h2>
          <div className="top-bar-right">
            <button className="notif-btn" onClick={() => navigate("/admin-notifications")}>
              <img src={bellIcon} alt="Notifications" />
            </button>
            <div className="user-profile active-profile">
              <img src={userIcon} alt="Admin Profile" />
            </div>
          </div>
        </header>

        <section className="content-body profile-layout">
          <div className="profile-card">
            <div className="profile-header-bg"></div>
            <div className="profile-content">
              <div className="profile-image-wrapper">
                <img src={userIcon} alt="Admin" className="profile-main-img" />
                <button className="edit-img-btn">📷</button>
              </div>
              
              <h2 className="profile-name">{user.username || "System Administrator"}</h2>
              <span className="profile-role-badge">Administrator</span>

              <div className="profile-details-grid">
                <div className="detail-item">
                  <label>Username</label>
                  <p>{user.username || "N/A"}</p>
                </div>
                <div className="detail-item">
                  <label>Email Address</label>
                  <p>{user.email || "admin@pawcruz.com"}</p>
                </div>
                <div className="detail-item">
                  <label>Account Status</label>
                  <p className="status-active">Active</p>
                </div>
                <div className="detail-item">
                  <label>Role</label>
                  <p>Super Admin</p>
                </div>
              </div>

              <div className="profile-actions">
                <button className="edit-profile-btn">Edit Profile Information</button>
                <button className="change-pass-btn" onClick={() => setShowResetModal(true)}>
                  Reset Password
                </button>
                <button 
                  className="logout-danger-btn" 
                  onClick={() => setShowLogoutModal(true)}
                >
                  Log Out of Account
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* LOGOUT CONFIRMATION MODAL */}
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
        {resetMessage && (
          <p className={`reset-message ${resetMessage.includes("sent") ? "success" : "error"}`}>
            {resetMessage}
          </p>
        )}
        <div className="modal-actions">
          <button className="confirm-btn" onClick={handleResetPassword}>
            {loading ? "Sending..." : "Send"}
          </button>
          <button className="cancel-btn" onClick={() => setShowResetModal(false)}>
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminProfile;
