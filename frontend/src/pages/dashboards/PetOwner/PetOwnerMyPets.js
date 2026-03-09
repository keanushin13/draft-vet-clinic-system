import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/PetOwnerMyPets.css";

// ASSETS
import appointmentIcon from "../../../assets/Appointment_Icon.png";
import bellIcon from "../../../assets/Bell_Icon.png";
import dashboardIcon from "../../../assets/Dashboard_Icon.png";
import medicalIcon from "../../../assets/Medical_Icon.png";
import messageIcon from "../../../assets/Message_Icon.png";
import pawLogo from "../../../assets/paw.png";
import paymentIcon from "../../../assets/payment_icon.png";
import petsIcon from "../../../assets/Pets_Icon.png";
import userIcon from "../../../assets/User_Icon.png";

const PetOwnerMyPets = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

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
          <img src={pawLogo} alt="Logo" />
          <span>PawCruz</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-item" onClick={() => navigate("/pet-owner")}>
            <img src={dashboardIcon} alt="" />
            <span>Dashboard</span>
          </div>
          
          <div className="nav-item" onClick={() => navigate("/pet-owner-appointments")}>
            <img src={appointmentIcon} alt="" />
            <span>Appointment</span>
          </div>

          <div className="nav-item active" onClick={() => navigate("/pet-owner-pets")}>
            <img src={petsIcon} alt="" />
            <span>My Pets</span>
          </div>

          <div className="nav-item" onClick={() => navigate("/pet-owner-messages")}>
            <img src={messageIcon} alt="" />
            <span>Messages</span>
          </div>

          <div className="nav-item" onClick={() => navigate("/pet-owner-records")}>
            <img src={medicalIcon} alt="" />
            <span>Medical Records</span>
          </div>

          <div className="nav-item" onClick={() => navigate("/pet-owner-payments")}>
            <img src={paymentIcon} alt="" />
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
              <img src={bellIcon} alt="Notifications" />
            </button>
            <div className="user-profile" onClick={() => navigate("/pet-owner-profile")}>
              <img src={userIcon} alt="User" />
            </div>
          </div>
        </header>

        <section className="content-body">
            <div className="pets-header-action" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h3 style={{fontFamily: 'Poppins', fontWeight: '600'}}>Manage Your Pets</h3>
                <button className="add-btn" style={{backgroundColor: '#438fb5', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer'}}>+ Add New Pet</button>
            </div>
            
            <div className="dashboard-welcome-card" style={{background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)'}}>
              <p style={{color: '#555'}}>You haven't registered any pets yet. Let's add one to get started!</p>
            </div>
        </section>
      </main>
    </div>
  );
};

export default PetOwnerMyPets;