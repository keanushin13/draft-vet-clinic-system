import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/PetOwnerDashboard.css";
import PetOwnerSidebar from "../../../components/PetOwnerSidebar";
import { useSidebar } from "../../../components/useSidebar";

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

const PetOwnerDashboard = () => {
  const navigate = useNavigate();
  // Safe parsing of user data
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { isOpen, toggle, close } = useSidebar();

  useEffect(() => {
    if (!user || user.role !== "pet_owner") {
      navigate("/login");
    }
  }, [navigate, user]);

  return (
    <div className="dashboard-container">
      <PetOwnerSidebar isOpen={isOpen} onClose={close} />

      {/* MAIN CONTENT */}
      <main className="main-area">
        <header className="top-bar">
          <button className="hamburger-btn" onClick={toggle} aria-label="Toggle menu"><span /><span /><span /></button>
          <h2>Welcome, {user?.name || 'Owner'}</h2>
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
            <div className="dashboard-header-action">
                <h3 style={{fontFamily: 'Poppins', fontWeight: '600', marginBottom: '15px'}}>Getting started</h3>
                <p style={{color: '#555', marginBottom: '25px'}}>Welcome to your PawCruz dashboard. Manage your pet's health and appointments here.</p>
            </div>
            
            <div className="dashboard-welcome-card" style={{background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)'}}>
              <h4 style={{marginBottom: '10px', color: '#255065'}}>Dashboard Overview</h4>
              <p style={{color: '#666'}}>Use the sidebar to navigate through your pet's medical history, book new appointments, or check your messages from the vet.</p>
            </div>
        </section>
      </main>
    </div>
  );
};

export default PetOwnerDashboard;