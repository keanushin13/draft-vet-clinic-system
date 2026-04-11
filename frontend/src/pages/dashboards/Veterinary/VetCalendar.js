import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/VetCalendar.css";

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

const VetCalendar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // FUNCTION: Security Guard (Matches PetOwner logic)
  useEffect(() => {
    if (!user || user.role !== "veterinarian") {
      navigate("/login");
    }
  }, [navigate, user]);

  return (
    <div className="dashboard-container">
      {/* SIDEBAR - Exact same logic as PetOwner */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={pawLogo} alt="Logo" />
          <span>PawCruz</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-item" onClick={() => navigate("/vet")}>
            <img src={dashboardIcon} alt="" />
            <span>Dashboard</span>
          </div>
          
          <div className="nav-item" onClick={() => navigate("/vet-patients")}>
            <img src={patientsIcon} alt="" />
            <span>Patients</span>
          </div>

          <div className="nav-item active" onClick={() => navigate("/vet-calendar")}>
            <img src={appointmentIcon} alt="" />
            <span>Calendar</span>
          </div>

          <div className="nav-item" onClick={() => navigate("/vet-messages")}>
            <img src={messageIcon} alt="" />
            <span>Messages</span>
          </div>

          <div className="nav-item" onClick={() => navigate("/vet-medical-records")}>
            <img src={medicalIcon} alt="" />
            <span>Medical Records</span>
          </div>

          <div className="nav-item" onClick={() => navigate("/vet-inventory")}>
            <img src={inventoryIcon} alt="" />
            <span>Inventory</span>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-area">
        <header className="top-bar">
          <h2>Vet Schedule</h2>
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
                <h3 style={{fontFamily: 'Poppins', fontWeight: '600', marginBottom: '15px'}}>Monthly Schedule</h3>
                <p style={{color: '#555', marginBottom: '25px'}}>Manage your clinic appointments and surgeries for this month.</p>
            </div>
            
            <div className="calendar-container-card" style={{background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)'}}>
              <div className="calendar-header" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
                 <h4 style={{color: '#255065'}}>February 2026</h4>
                 <button className="add-apt-btn" style={{backgroundColor: '#63b6c5', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer'}}>+ Add Appointment</button>
              </div>
              
              {/* Simplified Grid to represent the calendar UI */}
              <div className="calendar-grid-placeholder" style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px'}}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} style={{textAlign: 'center', fontWeight: '600', color: '#438fb5', paddingBottom: '10px'}}>{day}</div>
                ))}
                {Array.from({ length: 28 }).map((_, i) => (
                  <div key={i} style={{height: '80px', border: '1px solid #edf2f7', borderRadius: '8px', padding: '5px', fontSize: '12px', color: '#888'}}>
                    {i + 1}
                    {i === 13 && <div style={{background: '#c9eaf7', color: '#255065', padding: '2px', borderRadius: '4px', marginTop: '5px', fontSize: '10px'}}>Surgery: Max</div>}
                  </div>
                ))}
              </div>
            </div>
        </section>
      </main>
    </div>
  );
};

export default VetCalendar;