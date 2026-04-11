import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/PetOwnerDashboard.css";

// ASSETS
import appointmentIcon from "../../assets/Appointment_Icon.png";
import bellIcon from "../../assets/Bell_Icon.png";
import dashboardIcon from "../../assets/Dashboard_Icon.png";
import medicalIcon from "../../assets/Medical_Icon.png";
import messageIcon from "../../assets/Message_Icon.png";
import pawLogo from "../../assets/paw.png";
import paymentIcon from "../../assets/payment_icon.png";
import petsIcon from "../../assets/Pets_Icon.png";
import userIcon from "../../assets/Profile.png";
// Note: Ensure you have a placeholder or actual image for the pet illustration
import petPlaceholder from "../../assets/paw.png";

const PetOwnerDashboard = () => {
  const navigate = useNavigate();
  // Safe parsing of user data
  const user = JSON.parse(localStorage.getItem("user") || "{}");

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
          <div className="nav-item active" onClick={() => navigate("/pet-owner")}>
            <img src={dashboardIcon} alt="" className="nav-icon" />
            <span>Dashboard</span>
          </div>
          
          <div className="nav-item" onClick={() => navigate("/pet-owner-appointments")}>
            <img src={appointmentIcon} alt="" className="nav-icon" />
            <span>Appointment</span>
          </div>

          <div className="nav-item" onClick={() => navigate("/pet-owner-pets")}>
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
          <h2>Welcome, {user?.name || 'Pet Owner'}</h2>
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
            {/* TOP GRID FROM IMAGE */}
            <div className="pet-owner-grid">
              {/* MY PETS CARD */}
              <div className="glass-card">
                <div className="card-header">
                  <img src={petsIcon} className="tiny-icon" alt="" />
                  <h4>My Pets</h4>
                  <span className="count-badge">2</span>
                </div>
                <div className="pet-display-row">
                  <img src={petPlaceholder} alt="Pet" className="pet-img-circle" />
                  <div className="pet-info-text">
                    <strong>Bella & Max</strong>
                    <p>Pet_ID098787</p>
                    <button className="view-btn-sm" onClick={() => navigate("/pet-owner-pets")}>View Pet Profiles</button>
                  </div>
                </div>
              </div>

              {/* ALERTS CARD */}
              <div className="glass-card">
                <div className="card-header">
                  <img src={bellIcon} className="tiny-icon" alt="" />
                  <h4>Alerts</h4>
                  <span className="chevron-link">â€º</span>
                </div>
                <div className="item-row">
                  <div>
                    <p className="item-main">Vaccine due to Bella</p>
                    <p className="item-sub">Due Sep 13</p>
                  </div>
                  <span className="item-date">Sep 13</span>
                </div>
                <div className="item-row">
                  <div>
                    <p className="item-main">Medication due to Max</p>
                    <p className="item-sub">Due Sep 13</p>
                  </div>
                  <span className="item-date">Sep 13</span>
                </div>
              </div>

              {/* HISTORY CARD */}
              <div className="glass-card">
                <div className="card-header">
                  <h4>History</h4>
                  <span className="chevron-link">â€º</span>
                </div>
                <div className="item-row">
                  <p className="item-main">â‚±1000 Vaccination</p>
                  <span className="status-label">Paid</span>
                </div>
                <div className="item-row">
                  <p className="item-main">â‚±1200 Consultation</p>
                  <span className="status-label">Paid</span>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS BAR */}
            <div className="action-bar">
              <button className="action-btn" onClick={() => navigate("/pet-owner-pets")}>+ Register New Pet</button>
              <button className="action-btn" onClick={() => navigate("/pet-owner-appointments")}>Book Appointment</button>
              <button className="action-btn" onClick={() => navigate("/pet-owner-messages")}>Message Vet</button>
              <button className="action-btn" onClick={() => navigate("/pet-owner-records")}>View Medical</button>
            </div>

            {/* UPCOMING APPOINTMENTS SECTION */}
            <div className="bottom-section-card">
              <div className="section-header">
                <h4>Upcoming Appointments</h4>
                <span className="blue-link" onClick={() => navigate("/pet-owner-appointments")}>View All â€º</span>
              </div>
              
              <div className="appointment-flex">
                <div className="calendar-box">
                   <div className="cal-header">
                      <span>â€¹</span> <strong>September 2025</strong> <span>â€º</span>
                   </div>
                   <div className="cal-placeholder-grid"></div>
                </div>

                <div className="appt-details-side">
                  <div className="date-badge">Tuesday, Sep 9</div>
                  <div className="doctor-card">
                    <div className="doc-avatar"></div>
                    <div className="doc-info">
                      <p className="doc-name">Dr. Sarah Dela Cruz</p>
                      <p className="doc-sub">Bella (Golden Retriever)</p>
                    </div>
                  </div>
                  <p className="view-all-link" onClick={() => navigate("/pet-owner-appointments")}>View All â€º</p>
                </div>
              </div>
            </div>
        </section>
      </main>
    </div>
  );
};

export default PetOwnerDashboard;