import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/VetDashboard.css";

// ASSETS
import appointmentIcon from "../../assets/Appointment_Icon.png";
import bellIcon from "../../assets/Bell_Icon.png";
import dashboardIcon from "../../assets/Dashboard_Icon.png";
import medicalIcon from "../../assets/Medical_Icon.png";
import messageIcon from "../../assets/Message_Icon.png";
import pawLogo from "../../assets/paw.png";
import inventoryIcon from "../../assets/payment_icon.png";
import patientsIcon from "../../assets/Pets_Icon.png";
import userIcon from "../../assets/Profile.png";

const VetDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || user.role !== "veterinarian") {
      navigate("/login");
    }
  }, [navigate, user]);

  return (
    <div className="dashboard-container">
      {/* SIDEBAR - Messages is now above Medical Records */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={pawLogo} alt="Logo" />
          <span>PawCruz</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-item active" onClick={() => navigate("/vet")}>
            <img src={dashboardIcon} alt="" />
            <span>Dashboard</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/vet-patients")}>
            <img src={patientsIcon} alt="" />
            <span>Patients</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/vet-calendar")}>
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

      {/* MAIN CONTENT AREA */}
      <main className="main-area">
        <header className="top-bar">
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

        <section className="dashboard-body">
          {/* TOP ROW: 3 Columns */}
          <div className="top-row-grid">
            <div className="card-stat">
              <div className="card-header-row"><img src={appointmentIcon} alt="" /> <h4>Today's Appointment</h4></div>
              <div className="card-content">
                <p><span>â— Pending</span> <strong>7</strong></p>
                <p><span>â— Confirmed</span> <strong>4</strong></p>
              </div>
              <button className="card-btn-blue">View Calendar</button>
            </div>

            <div className="card-stat">
              <div className="card-header-row"><img src={patientsIcon} alt="" /> <h4>Patient Status</h4></div>
              <div className="card-content">
                <p><span>5 In Consult</span> <strong>5</strong></p>
                <p><span>2 Under Treatment</span> <strong>2</strong></p>
              </div>
              <button className="card-btn-blue">View All Pets</button>
            </div>

            <div className="card-stat">
              <div className="card-header-row"><img src={messageIcon} alt="" /> <h4>New Messages</h4></div>
              <div className="card-content">
                <p><span>2 from Staff</span> <strong>2</strong></p>
                <p><span>5 from Clients</span> <strong>5</strong></p>
              </div>
              <button className="card-btn-blue">Open Inbox</button>
            </div>
          </div>

          {/* BOTTOM ROW: Today's Appt, Inventory, and Notifications */}
          <div className="bottom-row-grid">
            <div className="card-details wide-card">
              <h4>Today's Appointments</h4>
              <div className="date-badge">Tuesday, Sep 9</div>
              <div className="list-entry">
                <div className="avatar-placeholder">ðŸ‘¤</div>
                <div className="entry-info">
                  <p className="p-main">Dr. Sarah Dela Cruz</p>
                  <p className="p-sub">Bella (Golden Retriever)</p>
                </div>
              </div>
              <div className="list-entry">
                <div className="avatar-placeholder">ðŸ‘¤</div>
                <div className="entry-info">
                  <p className="p-main">Dr. Micheal Cruz</p>
                  <p className="p-sub">Max (Persian)</p>
                </div>
              </div>
              <p className="text-link">View All â€º</p>
            </div>

            <div className="card-details">
              <h4>âš ï¸ Inventory Alerts</h4>
              <div className="alert-row"><span>2 Medications Low</span><small>Sep 13</small></div>
              <div className="alert-row"><span>1 Expiring Soon</span><small>Sep 13</small></div>
              <button className="card-btn-blue">View More</button>
            </div>

            <div className="card-details">
              <h4>Notifications</h4>
              <ul className="notif-ul">
                <li>Bella check up: April 24, 2025</li>
                <li>Max Rabies Vaccination</li>
                <li>Call Paul Tan for Bella</li>
              </ul>
              <button className="card-btn-blue">View All</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default VetDashboard;