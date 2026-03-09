import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/StaffDashboard.css";

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
          <img src={pawLogo} alt="Logo" className="nav-logo" />
          <span>PawCruz</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-item active" onClick={() => navigate("/staff")}>
            <img src={dashboardIcon} alt="" className="nav-icon" />
            <span>Dashboard</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/staff-appointments")}>
            <img src={appointmentIcon} alt="" className="nav-icon" />
            <span>Appointment</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/staff-users")}>
            <img src={userManagementIcon} alt="" className="nav-icon" />
            <span>User Management</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/staff-pets")}>
            <img src={petsProfileIcon} alt="" className="nav-icon" />
            <span>Pets Profile</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/staff-messages")}>
            <img src={messageIcon} alt="" className="nav-icon" />
            <span>Messages</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/staff-inventory")}>
            <img src={inventoryIcon} alt="" className="nav-icon" />
            <span>Inventory</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/staff-payments")}>
            <img src={payHistoryIcon} alt="" className="nav-icon" />
            <span>Payment History</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/staff-activity")}>
            <img src={activityLogIcon} alt="" className="nav-icon" />
            <span>Activity Log</span>
          </div>
        </nav>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="main-area">
        <header className="top-bar">
          <h2 className="welcome-text">Welcome, Staff</h2>
          <div className="top-bar-right">
            {/* CLICKABLE NOTIFICATION BELL */}
            <button className="notif-btn" onClick={() => navigate("/staff-notifications")}>
              <img src={bellIcon} alt="Notifications" className="top-icon" />
            </button>
            {/* CLICKABLE PROFILE */}
            <div className="user-profile" onClick={() => navigate("/staff-profile")}>
              <img src={userIcon} alt="Profile" className="top-avatar" />
            </div>
          </div>
        </header>

        {/* SCROLLABLE BODY */}
        <section className="dashboard-scroll-body">
          
          <div className="staff-grid-3">
            <div className="glass-card">
              <div className="card-header">
                <img src={petsProfileIcon} className="tiny-icon" alt="" /> 
                <h4>Registered Pets</h4>
              </div>
              <div className="val-row">
                <img src={userIcon} alt="" className="tiny-icon opacity-5" />
                <span className="big-number">236</span>
              </div>
              <button className="flat-btn" onClick={() => navigate("/staff-pets")}>View All Pets</button>
            </div>

            <div className="glass-card">
              <div className="card-header">
                <img src={inventoryIcon} className="tiny-icon" alt="" /> 
                <h4>Inventory Alerts</h4>
              </div>
              <div className="alert-row"><span>2 Medications Low</span> <small>Sep 13</small></div>
              <div className="alert-row"><span>1 Expiring Soon</span> <small>Sep 13</small></div>
            </div>

            <div className="glass-card">
              <div className="card-header"><h4>Activity Log</h4></div>
              <div className="mini-log">
                <div className="log-circle"></div>
                <div className="log-txt">
                  <p><strong>Mark Santos</strong></p>
                  <p className="sub-txt">09/23/2025</p>
                </div>
              </div>
              <div className="mini-log">
                <div className="log-circle"></div>
                <div className="log-txt">
                  <p><strong>Bianca Gonzales</strong></p>
                  <p className="sub-txt">01/23/2025</p>
                </div>
              </div>
            </div>
          </div>

          <div className="action-bar">
            <button className="action-btn" onClick={() => navigate("/staff-pets")}>Register New Pet</button>
            <button className="action-btn" onClick={() => navigate("/staff-appointments")}>Book Appointment</button>
            <button className="action-btn" onClick={() => navigate("/staff-inventory")}>Inventory</button>
            <button className="action-btn" onClick={() => navigate("/staff-payments")}>View Transaction</button>
          </div>

          <div className="bottom-section-card">
            <div className="section-header">
              <h4>Today's Appointments</h4>
              <span className="blue-link" onClick={() => navigate("/staff-appointments")}>View All ›</span>
            </div>
            
            <div className="appointment-flex">
              <div className="calendar-side">
                 <p className="cal-title">September 2025</p>
                 <div className="cal-grid-visual"></div>
              </div>

              <div className="list-side">
                <div className="gray-date-label">Tuesday, Sep 9</div>
                <div className="appt-entry">
                  <div className="profile-circle"></div>
                  <div className="entry-details">
                    <p className="main-name">Dr. Sarah Dela Cruz</p>
                    <p className="sub-name">Bella (Golden Retriever)</p>
                  </div>
                </div>
                <p className="bottom-centered-link" onClick={() => navigate("/staff-appointments")}>View All</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StaffDashboard;