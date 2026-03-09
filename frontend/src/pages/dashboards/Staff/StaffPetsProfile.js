import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/StaffPetsProfile.css";

// ASSETS
import appointmentIcon from "../../../assets/Appointment_Icon.png";
import bellIcon from "../../../assets/Bell_Icon.png";
import dashboardIcon from "../../../assets/Dashboard_Icon.png";
import inventoryIcon from "../../../assets/Inventory_Icon.png";
import activityLogIcon from "../../../assets/Medical_Icon.png";
import messageIcon from "../../../assets/Message_Icon.png";
import pawLogo from "../../../assets/paw.png";
import payHistoryIcon from "../../../assets/payment_icon.png";
import petsProfileIcon from "../../../assets/Pets_Icon.png";
import userIcon from "../../../assets/User_Icon.png";
import userManagementIcon from "../../../assets/UserManagement_Icon.png";

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
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={pawLogo} alt="Logo" />
          <span>PawCruz</span>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-item" onClick={() => navigate("/staff")}><img src={dashboardIcon} alt="" /><span>Dashboard</span></div>
          <div className="nav-item" onClick={() => navigate("/staff-appointments")}><img src={appointmentIcon} alt="" /><span>Appointment</span></div>
          <div className="nav-item" onClick={() => navigate("/staff-users")}><img src={userManagementIcon} alt="" /><span>User Management</span></div>
          <div className="nav-item active" onClick={() => navigate("/staff-pets")}><img src={petsProfileIcon} alt="" /><span>Pets Profile</span></div>
          <div className="nav-item" onClick={() => navigate("/staff-messages")}><img src={messageIcon} alt="" /><span>Messages</span></div>
          <div className="nav-item" onClick={() => navigate("/staff-inventory")}><img src={inventoryIcon} alt="" /><span>Inventory</span></div>
          <div className="nav-item" onClick={() => navigate("/staff-payments")}><img src={payHistoryIcon} alt="" /><span>Payment History</span></div>
          <div className="nav-item" onClick={() => navigate("/staff-activity")}><img src={activityLogIcon} alt="" /><span>Activity Log</span></div>
        </nav>
      </aside>

      <main className="main-area">
        <header className="top-bar">
          <h2>Pets Profile</h2>
          <div className="top-bar-right">
            <button className="notif-btn" onClick={() => navigate("/staff-notifications")}>
              <img src={bellIcon} alt="Notif" />
            </button>
            <div className="user-profile" onClick={() => navigate("/staff-profile")}>
              <img src={userIcon} alt="Profile" />
            </div>
          </div>
        </header>

        <section className="content-body">
          <div className="pets-mgmt-header">
            <div className="pet-search-bar">
              <input type="text" placeholder="Search by pet name, breed, or owner..." />
            </div>
            <button className="add-pet-btn">+ Register Pet</button>
          </div>

          <div className="pets-grid">
            {pets.map((pet) => (
              <div key={pet.id} className="pet-card">
                <div className="pet-card-top">
                  <div className="pet-avatar-placeholder">
                    {pet.name.charAt(0)}
                  </div>
                  <div className="pet-title-info">
                    <h3>{pet.name}</h3>
                    <span>{pet.breed}</span>
                  </div>
                  <span className={`pet-status-tag ${pet.status.toLowerCase().replace(' ', '-')}`}>
                    {pet.status}
                  </span>
                </div>
                
                <div className="pet-card-body">
                  <div className="pet-info-row">
                    <label>Owner:</label>
                    <p>{pet.owner}</p>
                  </div>
                  <div className="pet-info-row">
                    <label>Gender / Age:</label>
                    <p>{pet.gender}, {pet.age}</p>
                  </div>
                </div>

                <div className="pet-card-footer">
                  <button className="btn-view-records">Medical Records</button>
                  <button className="btn-edit-pet">Edit</button>
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