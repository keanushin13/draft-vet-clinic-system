import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../../css/PetOwnerProfile.css";

// ASSETS
import appointmentIcon from "../../../assets/Appointment_Icon.png";
import bellIcon from "../../../assets/Bell_Icon.png";
import dashboardIcon from "../../../assets/Dashboard_Icon.png";
import medicalIcon from "../../../assets/Medical_Icon.png";
import messageIcon from "../../../assets/Message_Icon.png";
import pawLogo from "../../../assets/paw.png";
import paymentIcon from "../../../assets/payment_icon.png";
import petsIcon from "../../../assets/Pets_Icon.png";
import userIcon from "../../../assets/Profile.png";

const PetOwnerProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || user.role !== "pet_owner") {
      navigate("/login");
    }
  }, [navigate, user]);

  const handleLogout = () => {
    // Clear local storage to end session
    localStorage.removeItem("user");
    localStorage.removeItem("token"); 
    // Redirect to login page
    navigate("/login");
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
          <div className={`nav-item ${location.pathname === "/pet-owner" ? "active" : ""}`} onClick={() => navigate("/pet-owner")}>
            <img src={dashboardIcon} alt="" />
            <span>Dashboard</span>
          </div>
          <div className={`nav-item ${location.pathname === "/pet-owner-appointments" ? "active" : ""}`} onClick={() => navigate("/pet-owner-appointments")}>
            <img src={appointmentIcon} alt="" />
            <span>Appointment</span>
          </div>
          <div className={`nav-item ${location.pathname === "/pet-owner-pets" ? "active" : ""}`} onClick={() => navigate("/pet-owner-pets")}>
            <img src={petsIcon} alt="" />
            <span>My Pets</span>
          </div>
          <div className={`nav-item ${location.pathname === "/pet-owner-messages" ? "active" : ""}`} onClick={() => navigate("/pet-owner-messages")}>
            <img src={messageIcon} alt="" />
            <span>Messages</span>
          </div>
          <div className={`nav-item ${location.pathname === "/pet-owner-records" ? "active" : ""}`} onClick={() => navigate("/pet-owner-records")}>
            <img src={medicalIcon} alt="" />
            <span>Medical Records</span>
          </div>
          <div className={`nav-item ${location.pathname === "/pet-owner-payments" ? "active" : ""}`} onClick={() => navigate("/pet-owner-payments")}>
            <img src={paymentIcon} alt="" />
            <span>Payment History</span>
          </div>

          {/* LOGOUT BUTTON */}
          <div className="nav-item logout-item" onClick={handleLogout}>
            <span>Logout</span>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-area">
        <header className="top-bar">
          <h2>My Profile</h2>
          <div className="top-bar-right">
            <button className="notif-btn" onClick={() => navigate("/pet-owner-notifications")}>
              <img src={bellIcon} alt="Notifications" />
            </button>
            <div className="user-profile" onClick={() => navigate("/pet-owner-profile")}>
              <img src={userIcon} alt="User" />
            </div>
          </div>
        </header>

        <section className="content-body">
            <div className="dashboard-welcome-card">
              <h3>Profile Information</h3>
              <p>Manage your account details and preferences.</p>
            </div>
        </section>
      </main>
    </div>
  );
};

export default PetOwnerProfile;