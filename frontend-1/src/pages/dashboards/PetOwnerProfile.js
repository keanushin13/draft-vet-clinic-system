import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../css/PetOwnerProfile.css";
import Modal from "../security/Modal";
import API from "../../api/api";

// ASSETS
import appointmentIcon from "../../assets/Appointment_Icon.png";
import bellIcon from "../../assets/Bell_Icon.png";
import dashboardIcon from "../../assets/Dashboard_Icon.png";
import medicalIcon from "../../assets/Medical_Icon.png";
import messageIcon from "../../assets/Message_Icon.png";
import pawLogo from "../../assets/paw.png";
import paymentIcon from "../../assets/payment_icon.png";
import petsIcon from "../../assets/Pets_Icon.png";
import userIcon from "../../assets/User_Icon.png";

const PetOwnerProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState(""); // email typed by user

  useEffect(() => {
    if (!user || user.role !== "pet_owner") {
      navigate("/login");
    } else if (!user.email) {
      console.warn("No email found in user object");
    }
  }, [navigate, user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleResetPassword = async () => {
  if (!resetEmail) {
    alert("Please enter your email."); // optional: replace with message in modal
    return;
  }

  setLoading(true);

  try {
    const res = await API.post("/users/forgot-password", { email: resetEmail });
    setResetEmail(""); // clear input
    setShowResetConfirmModal(false);
    alert(res.data.message || "Reset link sent!"); // you can replace with a modal if preferred
  } catch (err) {
    setShowResetConfirmModal(false);
    alert(err.response?.data?.message || "Failed to send reset link.");
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={pawLogo} alt="Logo" className="nav-logo" />
          <span>PawCruz</span>
        </div>

        <nav className="sidebar-nav">
          <div className={`nav-item ${location.pathname === "/pet-owner" ? "active" : ""}`} onClick={() => navigate("/pet-owner")}>
            <img src={dashboardIcon} alt="" className="nav-icon" />
            <span>Dashboard</span>
          </div>
          <div className={`nav-item ${location.pathname === "/pet-owner-appointments" ? "active" : ""}`} onClick={() => navigate("/pet-owner-appointments")}>
            <img src={appointmentIcon} alt="" className="nav-icon" />
            <span>Appointment</span>
          </div>
          <div className={`nav-item ${location.pathname === "/pet-owner-pets" ? "active" : ""}`} onClick={() => navigate("/pet-owner-pets")}>
            <img src={petsIcon} alt="" className="nav-icon" />
            <span>My Pets</span>
          </div>
          <div className={`nav-item ${location.pathname === "/pet-owner-messages" ? "active" : ""}`} onClick={() => navigate("/pet-owner-messages")}>
            <img src={messageIcon} alt="" className="nav-icon" />
            <span>Messages</span>
          </div>
          <div className={`nav-item ${location.pathname === "/pet-owner-records" ? "active" : ""}`} onClick={() => navigate("/pet-owner-records")}>
            <img src={medicalIcon} alt="" className="nav-icon" />
            <span>Medical Records</span>
          </div>
          <div className={`nav-item ${location.pathname === "/pet-owner-payments" ? "active" : ""}`} onClick={() => navigate("/pet-owner-payments")}>
            <img src={paymentIcon} alt="" className="nav-icon" />
            <span>Payment History</span>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-area">
        <header className="top-bar">
          <h2>My Profile</h2>
          <div className="top-bar-right">
            <button className="notif-btn" onClick={() => navigate("/pet-owner-notifications")}>
              <img src={bellIcon} alt="Notifications" className="top-icon" />
            </button>
            <div className="user-profile active-profile">
              <img src={userIcon} alt="User" className="top-avatar" />
            </div>
          </div>
        </header>

        <section className="dashboard-scroll-body">
          <div className="profile-layout">
            {/* LEFT SIDE: AVATAR & LOGOUT */}
            <div className="profile-card-side">
              <div className="profile-avatar-box">
                <img src={userIcon} alt="Avatar" />
                <button className="change-photo-btn">Change Photo</button>
              </div>
              <div className="profile-meta">
                <h3>{user?.name || 'Pet Owner'}</h3>
                <p className="user-role-badge">Verified Pet Owner</p>
              </div>

              <button className="content-logout-btn" onClick={() => setShowLogoutModal(true)}>
                Logout Account
              </button>
            </div>

            {/* RIGHT SIDE: EDITABLE FORM */}
            <div className="profile-details-side">
              <div className="details-header">
                <h3>Personal Information</h3>
                <button className="save-btn-rect">Save Changes</button>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" defaultValue={user?.name} placeholder="Enter full name" />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" placeholder="Enter email" disabled />
                </div>
              </div>

              <div className="details-header secondary">
                <h3>Security</h3>
              </div>
              <div className="form-group">
                <label>Current Password</label>
                <input type="password" placeholder="********" />
              </div>
              <button
                className="password-link"
                onClick={() => setShowResetConfirmModal(true)}
              >
                Reset Password
              </button>

            </div>
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

        {/* RESET PASSWORD CONFIRM MODAL */}
        <Modal show={showResetConfirmModal} onClose={() => setShowResetConfirmModal(false)}>
          <h3>Reset Password</h3>
          <p>Send password reset link to your Gmail?</p>
          <div className="modal-actions">
            <button className="confirm-btn" onClick={handleResetPassword}>
              {loading ? "Sending..." : "Yes"}
            </button>
            <button className="cancel-btn" onClick={() => setShowResetConfirmModal(false)}>
              Cancel
            </button>
          </div>
        </Modal>

        {/* RESET PASSWORD SENT MODAL */}
        <Modal show={showResetConfirmModal} onClose={() => setShowResetConfirmModal(false)}>
          <h3>Reset Password</h3>
          <p>Please enter your email to receive a password reset link:</p>
          <input
            type="email"
            placeholder="Enter your email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            className="modal-input"
          />
          <div className="modal-actions">
            <button className="confirm-btn" onClick={handleResetPassword}>
              {loading ? "Sending..." : "Send"}
            </button>
            <button className="cancel-btn" onClick={() => setShowResetConfirmModal(false)}>
              Cancel
            </button>
          </div>
        </Modal>


      </main>
    </div>
  );
};

export default PetOwnerProfile;
