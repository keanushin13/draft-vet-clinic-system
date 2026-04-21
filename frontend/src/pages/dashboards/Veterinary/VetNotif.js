import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/VetNotif.css";
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

const VetNotif = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { isOpen, toggle, close } = useSidebar();

  // Dummy Notification Data
  const [notifications] = useState([
    {
      id: 1,
      title: "New Appointment Request",
      message: "Juan Dela Cruz requested a checkup for Max on Feb 10, 2026.",
      time: "10 minutes ago",
      unread: true,
      type: "appointment"
    },
    {
      id: 2,
      title: "Low Stock Alert",
      message: "Amoxicillin 250mg is running low (5 units left).",
      time: "2 hours ago",
      unread: true,
      type: "inventory"
    },
    {
      id: 3,
      title: "Lab Results Ready",
      message: "Bloodwork results for Luna (Maria Santos) are now available.",
      time: "Yesterday",
      unread: false,
      type: "medical"
    }
  ]);

  // FUNCTION: Security Guard
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
          <h2>Notifications</h2>
          <div className="top-bar-right">
            <button className="notif-btn active">
              <img src={bellIcon} alt="Notifications" />
            </button>
            <div className="user-profile" onClick={() => navigate("/vet-profile")}>
              <img src={userIcon} alt="User" />
            </div>
          </div>
        </header>

        <section className="content-body">
          <div className="notif-wrapper">
            <div className="notif-header-flex" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
               <h3 style={{color: '#255065', fontWeight: '600'}}>Recent Updates</h3>
               <button style={{background: 'none', border: 'none', color: '#438fb5', cursor: 'pointer', fontSize: '14px'}}>Mark all as read</button>
            </div>

            {notifications.map((notif) => (
              <div key={notif.id} className={`notif-card ${notif.unread ? 'unread' : ''}`}>
                <div className="notif-icon-circle">
                  <img src={notif.type === 'inventory' ? inventoryIcon : notif.type === 'appointment' ? appointmentIcon : medicalIcon} alt="icon" />
                </div>
                <div className="notif-content">
                  <h4>{notif.title}</h4>
                  <p>{notif.message}</p>
                  <span className="notif-time">{notif.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default VetNotif;