import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/VetDashboard.css";
import VetSidebar from "../../../components/VetSidebar";
import { useSidebar } from "../../../components/useSidebar";

// ASSETS
import appointmentIcon from "../../../assets/Appointment_Icon.png";
import bellIcon from "../../../assets/Bell_Icon.png";
import dashboardIcon from "../../../assets/Dashboard_Icon.png";
import medicalIcon from "../../../assets/Medical_Icon.png";
import messageIcon from "../../../assets/Message_Icon.png";
import pawLogo from "../../../assets/paw.png";
import inventoryIcon from "../../../assets/payment_icon.png";
import patientsIcon from "../../../assets/Pets_Icon.png";
import userIcon from "../../../assets/Profile.png";

const VetDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { isOpen, toggle, close } = useSidebar();

  // FUNCTION: Guard Clause (Matches PetOwner logic)
  useEffect(() => {
    if (!user || user.role !== "veterinarian") {
      navigate("/login");
    }
  }, [navigate, user]);

  return (
    <div className="dashboard-container">
      <VetSidebar isOpen={isOpen} onClose={close} />

      {/* MAIN CONTENT */}
      <main className="main-area">
        <header className="top-bar">
                    <button className="hamburger-btn" onClick={toggle} aria-label="Toggle menu"><span /><span /><span /></button>
          {/* Functional Greeting: Matches user.name || 'Doctor' pattern */}
          <h2>Welcome, Dr. {user?.name || 'Veterinarian'}</h2>
          <div className="top-bar-right">
            <button className="notif-btn" onClick={() => navigate("/vet-notifications")}>
              <img src={bellIcon} alt="Notifications" />
            </button>
            <div className="user-profile" onClick={() => navigate("/vet-profile")}>
              <img src={userIcon} alt="User" />
            </div>
          </div>
        </header>

        <section className="content-body">
            <div className="dashboard-header-action">
                <h3 style={{fontFamily: 'Poppins', fontWeight: '600', marginBottom: '15px'}}>Clinic Management</h3>
                <p style={{color: '#555', marginBottom: '25px'}}>
                  Welcome to the Veterinary portal. Access patient histories and daily schedules here.
                </p>
            </div>
            
            <div className="dashboard-welcome-card" style={{background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)'}}>
              <h4 style={{marginBottom: '10px', color: '#255065'}}>Quick Overview</h4>
              <p style={{color: '#666'}}>
                Use the sidebar to manage clinical tasks. Your dashboard provides a centralized view of all veterinary operations.
              </p>
            </div>
        </section>
      </main>
    </div>
  );
};

export default VetDashboard;