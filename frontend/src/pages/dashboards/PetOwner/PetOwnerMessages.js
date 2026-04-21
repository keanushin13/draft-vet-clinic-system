import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/PetOwnerMessages.css";
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

const PetOwnerMessages = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
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
          <h2>Messages</h2>
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
            <div className="message-header-action" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h3 style={{fontFamily: 'Poppins', fontWeight: '600'}}>Conversations</h3>
                <button className="new-msg-btn" style={{backgroundColor: '#438fb5', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer'}}>+ Start New Chat</button>
            </div>
            
            <div className="dashboard-welcome-card" style={{background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)'}}>
              <p style={{color: '#555'}}>No active conversations. Reach out to your vet to start a chat!</p>
            </div>
        </section>
      </main>
    </div>
  );
};

export default PetOwnerMessages;