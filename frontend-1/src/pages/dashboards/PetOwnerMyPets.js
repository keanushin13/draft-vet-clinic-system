import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/PetOwnerMyPets.css";

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

const PetOwnerMyPets = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // Mock data for pets
  const [pets] = useState([
    { id: "098787", name: "Bella", species: "Dog", breed: "Golden Retriever", age: "3 yrs", weight: "28kg", gender: "Female" },
    { id: "098788", name: "Max", species: "Cat", breed: "Persian", age: "2 yrs", weight: "4.5kg", gender: "Male" }
  ]);

  useEffect(() => {
    if (!user || user.role !== "pet_owner") {
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
          <div className="nav-item" onClick={() => navigate("/pet-owner")}>
            <img src={dashboardIcon} alt="" className="nav-icon" />
            <span>Dashboard</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/pet-owner-appointments")}>
            <img src={appointmentIcon} alt="" className="nav-icon" />
            <span>Appointment</span>
          </div>
          <div className="nav-item active" onClick={() => navigate("/pet-owner-pets")}>
            <img src={petsIcon} alt="" className="nav-icon" />
            <span>My Pets</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/pet-owner-messages")}>
            <img src={messageIcon} alt="" className="nav-icon" />
            <span>Messages</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/pet-owner-records")}>
            <img src={medicalIcon} alt="" className="nav-icon" />
            <span>Medical Records</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/pet-owner-payments")}>
            <img src={paymentIcon} alt="" className="nav-icon" />
            <span>Payment History</span>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-area">
        <header className="top-bar">
          <h2>My Pets</h2>
          <div className="top-bar-right">
            <button className="notif-btn" onClick={() => navigate("/pet-owner-notifications")}>
              <img src={bellIcon} alt="Notifications" className="top-icon" />
            </button>
            <div className="user-profile" onClick={() => navigate("/pet-owner-profile")}>
              <img src={userIcon} alt="User" className="top-avatar" />
            </div>
          </div>
        </header>

        <section className="dashboard-scroll-body">
          <div className="pets-header-action">
              <h3 className="section-title">Manage Your Pets</h3>
              <button className="add-pet-btn-rect">+ Add New Pet</button>
          </div>
          
          <div className="pets-grid">
            {pets.length > 0 ? (
              pets.map(pet => (
                <div key={pet.id} className="pet-card">
                  <div className="pet-card-header">
                    <div className="pet-avatar-large">
                      <img src={pawLogo} alt="pet" />
                    </div>
                    <div className="pet-id-tag">#{pet.id}</div>
                  </div>
                  
                  <div className="pet-card-body">
                    <h4>{pet.name}</h4>
                    <p className="pet-breed">{pet.breed}</p>
                    
                    <div className="pet-stats-row">
                      <div className="stat-item">
                        <span>Age</span>
                        <strong>{pet.age}</strong>
                      </div>
                      <div className="stat-item">
                        <span>Weight</span>
                        <strong>{pet.weight}</strong>
                      </div>
                      <div className="stat-item">
                        <span>Gender</span>
                        <strong>{pet.gender}</strong>
                      </div>
                    </div>

                    <div className="pet-card-actions">
                      <button className="action-outline" onClick={() => navigate("/pet-owner-records")}>
                        <img src={medicalIcon} className="tiny-icon" alt="" /> History
                      </button>
                      <button className="action-outline" onClick={() => navigate("/pet-owner-appointments")}>
                        <img src={appointmentIcon} className="tiny-icon" alt="" /> Book
                      </button>
                    </div>
                    
                    <button className="edit-pet-link">Edit Profile</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-pets-state">
                <img src={petsIcon} className="large-faded-icon" alt="" />
                <p>You haven't registered any pets yet. Let's add one to get started!</p>
                <button className="add-pet-btn-rect" style={{marginTop: '15px'}}>+ Add Pet</button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default PetOwnerMyPets;