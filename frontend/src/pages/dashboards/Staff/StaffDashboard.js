import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/StaffDashboard.css";

// ASSETS
import appointmentIcon from "../../../assets/Appointment_Icon.png";
import bellIcon from "../../../assets/Bell_Icon.png";
import dashboardIcon from "../../../assets/Dashboard_Icon.png";
import inventoryIcon from "../../../assets/Inventory_Icon.png";
import activityLogIcon from "../../../assets/Medical_Icon.png"; // Icon for Activity Log
import messageIcon from "../../../assets/Message_Icon.png";
import pawLogo from "../../../assets/paw.png";
import payHistoryIcon from "../../../assets/payment_icon.png";
import petsProfileIcon from "../../../assets/Pets_Icon.png";
import userIcon from "../../../assets/User_Icon.png";
import userManagementIcon from "../../../assets/UserManagement_Icon.png";

const StaffDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || user.role !== "staff") {
      navigate("/login");
    }
  }, [navigate, user]);

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={pawLogo} alt="Logo" />
          <span>PawCruz</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-item active" onClick={() => navigate("/staff")}>
            <img src={dashboardIcon} alt="" />
            <span>Dashboard</span>
          </div>
          
          <div className="nav-item" onClick={() => navigate("/staff-appointments")}>
            <img src={appointmentIcon} alt="" />
            <span>Appointment</span>
          </div>

          <div className="nav-item" onClick={() => navigate("/staff-users")}>
            <img src={userManagementIcon} alt="" />
            <span>User Management</span>
          </div>

          <div className="nav-item" onClick={() => navigate("/staff-pets")}>
            <img src={petsProfileIcon} alt="" />
            <span>Pets Profile</span>
          </div>

          <div className="nav-item" onClick={() => navigate("/staff-messages")}>
            <img src={messageIcon} alt="" />
            <span>Messages</span>
          </div>

          <div className="nav-item" onClick={() => navigate("/staff-inventory")}>
            <img src={inventoryIcon} alt="" />
            <span>Inventory</span>
          </div>

          <div className="nav-item" onClick={() => navigate("/staff-payments")}>
            <img src={payHistoryIcon} alt="" />
            <span>Payment History</span>
          </div>

          {/* ADDED: Activity Log Navigation */}
          <div className="nav-item" onClick={() => navigate("/staff-activity")}>
            <img src={activityLogIcon} alt="" />
            <span>Activity Log</span>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-area">
        <header className="top-bar">
          <h2>Welcome, Staff</h2>
          <div className="top-bar-right">
            <button className="notif-btn" onClick={() => navigate("/staff-notifications")}>
              <img src={bellIcon} alt="Notifications" />
            </button>
            <div className="user-profile" onClick={() => navigate("/staff-profile")}>
              <img src={userIcon} alt="User" />
            </div>
          </div>
        </header>

        {/* Empty Content Area - Ready for custom content */}
        <section className="content-body">
          <div className="dashboard-header-action">
            <h3 style={{fontFamily: 'Poppins', fontWeight: '600', marginBottom: '15px'}}>Staff Portal</h3>
            <p style={{color: '#555', marginBottom: '25px'}}>Manage clinic operations, view pet profiles, and track activities from this central hub.</p>
          </div>
          
          <div className="dashboard-welcome-card" style={{background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)'}}>
            <h4 style={{marginBottom: '10px', color: '#255065'}}>Operation Overview</h4>
            <p style={{color: '#666'}}>Select an option from the sidebar to manage users, appointments, or clinic inventory.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StaffDashboard;