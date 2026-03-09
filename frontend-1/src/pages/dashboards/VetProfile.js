import { useEffect, useState } from "react"; // ✅ added useState
import { useNavigate } from "react-router-dom";
import "../../css/VetProfile.css";
import Modal from "../security/Modal"; // adjust path if needed
import API from "../../api/api"; // your Axios instance

// ASSETS
import appointmentIcon from "../../assets/Appointment_Icon.png";
import bellIcon from "../../assets/Bell_Icon.png";
import dashboardIcon from "../../assets/Dashboard_Icon.png";
import medicalIcon from "../../assets/Medical_Icon.png";
import messageIcon from "../../assets/Message_Icon.png";
import pawLogo from "../../assets/paw.png";
import inventoryIcon from "../../assets/payment_icon.png";
import patientsIcon from "../../assets/Pets_Icon.png";
import userIcon from "../../assets/User_Icon.png";

const VetProfile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Modals
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false); // reset password modal
  const [resetEmail, setResetEmail] = useState(""); // typed email
  const [loading, setLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState(""); // success/error message

  // Guard clause
  useEffect(() => {
    if (!user || user.role !== "veterinarian") {
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
          <div className="nav-item" onClick={() => navigate("/vet")}>
            <img src={dashboardIcon} alt="" />
            <span>Dashboard</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/vet-patients")}>
            <img src={patientsIcon} alt="" />
            <span>Patients</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/vet-calendar")}>
            <img src={appointmentIcon} alt="" />
            <span>Calendar</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/vet-messages")}>
            <img src={messageIcon} alt="" />
            <span>Messages</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/vet-medical-records")}>
            <img src={medicalIcon} alt="" />
            <span>Medical Records</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/vet-inventory")}>
            <img src={inventoryIcon} alt="" />
            <span>Inventory</span>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-area">
        <header className="top-bar">
          <h2>My Profile</h2>
          <div className="top-bar-right">
            <button className="notif-btn" onClick={() => navigate("/vet-notifications")}>
              <img src={bellIcon} alt="Notifications" />
            </button>
            <div className="user-profile active">
              <img src={userIcon} alt="User" />
            </div>
          </div>
        </header>

        <section className="content-body">
          <div className="profile-container-card">
            <div className="profile-header-section">
              <div className="profile-avatar-large">
                <img src={userIcon} alt="Avatar" />
              </div>
              <div className="profile-intro">
                <h3>Dr. {user?.name || user?.username || "Veterinarian"}</h3>
                <p className="role-badge">Verified Veterinarian</p>
              </div>
            </div>

            <div className="profile-details-grid">
              <div className="detail-group">
                <label>Full Name</label>
                <p>{user?.name || "Not Set"}</p>
              </div>
              <div className="detail-group">
                <label>Email Address</label>
                <p>{user?.email || "Not Set"}</p>
              </div>
              <div className="detail-group">
                <label>Username</label>
                <p>{user?.username}</p>
              </div>
              <div className="detail-group">
                <label>Clinic Role</label>
                <p style={{ textTransform: "capitalize" }}>{user?.role}</p>
              </div>
            </div>

            {/* Profile Actions */}
            <div className="profile-actions">
              <button className="edit-profile-btn">Edit Details</button>
              <button className="change-pass-btn" onClick={() => setShowResetModal(true)}>
                Change / Reset Password
              </button>
              <button className="logout-btn" onClick={() => setShowLogoutModal(true)}>
                Logout Account
              </button>
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

export default VetProfile;
