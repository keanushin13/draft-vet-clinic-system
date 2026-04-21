import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/StaffDashboard.css";
import StaffSidebar from "../../../components/StaffSidebar";
import { useSidebar } from "../../../components/useSidebar";

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
import userIcon from "../../../assets/Profile.png";
import userManagementIcon from "../../../assets/UserManagement_Icon.png";

const StaffDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { isOpen, toggle, close } = useSidebar();

  useEffect(() => {
    if (!user || user.role !== "staff") {
      navigate("/login");
    }
  }, [navigate, user]);

  return (
    <div className="dashboard-container">
      <StaffSidebar isOpen={isOpen} onClose={close} />

      {/* MAIN CONTENT */}
      <main className="main-area">
        <header className="top-bar">
          <button className="hamburger-btn" onClick={toggle} aria-label="Toggle menu"><span /><span /><span /></button>
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