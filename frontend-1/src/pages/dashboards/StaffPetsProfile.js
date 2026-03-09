import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/StaffPetsProfile.css";

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

const StaffPetsProfile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [pets] = useState([
    { id: 1, name: "Bella", breed: "Golden Retriever", owner: "Juan Dela Cruz", age: "2 yrs", gender: "Female", status: "Healthy" },
    { id: 2, name: "Max", breed: "Persian Cat", owner: "Maria Clara", age: "1 yr", gender: "Male", status: "Under Treatment" },
    { id: 3, name: "Luna", breed: "Siamese Cat", owner: "Pedro Penduko", age: "3 yrs", gender: "Female", status: "Healthy" },
    { id: 4, name: "Cooper", breed: "Beagle", owner: "Elena Gilbert", age: "4 yrs", gender: "Male", status: "Healthy" },
  ]);

  useEffect(() => {
    if (!user || user.role !== "staff") {
      navigate("/login");
    }
  }, [navigate, user]);

  return (
    <div className="dashboard-container">
      {/* SIDEBAR - Fixed sizing */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={pawLogo} alt="Logo" className="nav-logo" />
          <span>PawCruz</span>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-item" onClick={() => navigate("/staff")}><img src={dashboardIcon} className="nav-icon" alt="" /><span>Dashboard</span></div>
          <div className="nav-item" onClick={() => navigate("/staff-appointments")}><img src={appointmentIcon} className="nav-icon" alt="" /><span>Appointment</span></div>
          <div className="nav-item" onClick={() => navigate("/staff-users")}><img src={userManagementIcon} className="nav-icon" alt="" /><span>User Management</span></div>
          <div className="nav-item active" onClick={() => navigate("/staff-pets")}><img src={petsProfileIcon} className="nav-icon" alt="" /><span>Pets Profile</span></div>
          <div className="nav-item" onClick={() => navigate("/staff-messages")}><img src={messageIcon} className="nav-icon" alt="" /><span>Messages</span></div>
          <div className="nav-item" onClick={() => navigate("/staff-inventory")}><img src={inventoryIcon} className="nav-icon" alt="" /><span>Inventory</span></div>
          <div className="nav-item" onClick={() => navigate("/staff-payments")}><img src={payHistoryIcon} className="nav-icon" alt="" /><span>Payment History</span></div>
          <div className="nav-item" onClick={() => navigate("/staff-activity")}><img src={activityLogIcon} className="nav-icon" alt="" /><span>Activity Log</span></div>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="main-area">
        <header className="top-bar">
          <h2>Pets Profile</h2>
          <div className="top-bar-right">
            <button className="notif-btn" onClick={() => navigate("/staff-notifications")}>
              <img src={bellIcon} className="top-icon" alt="Notif" />
            </button>
            <div className="user-profile" onClick={() => navigate("/staff-profile")}>
              <img src={userIcon} className="top-avatar" alt="Profile" />
            </div>
          </div>
        </header>

        {/* SCROLLABLE GRID */}
        <section className="dashboard-scroll-body">
          <div className="pets-mgmt-header">
            <div className="pet-search-container">
              <input type="text" placeholder="Search by pet name, breed, or owner..." className="pet-search-input" />
            </div>
            <button className="register-pet-btn">Register New Pet</button>
          </div>

          <div className="pets-card-grid">
            {pets.map((pet) => (
              <div key={pet.id} className="pet-profile-card">
                <div className="pet-card-header">
                  <div className="pet-avatar-circle">
                    {pet.name.charAt(0)}
                  </div>
                  <div className="pet-name-box">
                    <h3>{pet.name}</h3>
                    <p>{pet.breed}</p>
                  </div>
                  <div className={`status-dot ${pet.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {pet.status}
                  </div>
                </div>
                
                <div className="pet-card-details">
                  <div className="detail-line">
                    <strong>Owner:</strong> <span>{pet.owner}</span>
                  </div>
                  <div className="detail-line">
                    <strong>Gender/Age:</strong> <span>{pet.gender}, {pet.age}</span>
                  </div>
                </div>

                <div className="pet-card-actions">
                  <button className="btn-secondary">Medical Records</button>
                  <button className="btn-primary-small">Edit</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default StaffPetsProfile;