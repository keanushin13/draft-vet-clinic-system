import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/StaffAppointment.css";

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

const StaffAppointment = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [viewMode, setViewMode] = useState("calendar");

  const days = Array.from({ length: 28 }, (_, i) => i + 1);

  const [appointments] = useState([
    { id: 1, petName: "Bella", day: 10, time: "09:00 AM", status: "confirmed" },
    { id: 2, petName: "Max", day: 10, time: "11:30 AM", status: "pending" },
    { id: 3, petName: "Luna", day: 15, time: "02:00 PM", status: "confirmed" },
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
          <div className="nav-item active" onClick={() => navigate("/staff-appointments")}><img src={appointmentIcon} alt="" /><span>Appointment</span></div>
          <div className="nav-item" onClick={() => navigate("/staff-users")}><img src={userManagementIcon} alt="" /><span>User Management</span></div>
          <div className="nav-item" onClick={() => navigate("/staff-pets")}><img src={petsProfileIcon} alt="" /><span>Pets Profile</span></div>
          <div className="nav-item" onClick={() => navigate("/staff-messages")}><img src={messageIcon} alt="" /><span>Messages</span></div>
          <div className="nav-item" onClick={() => navigate("/staff-inventory")}><img src={inventoryIcon} alt="" /><span>Inventory</span></div>
          <div className="nav-item" onClick={() => navigate("/staff-payments")}><img src={payHistoryIcon} alt="" /><span>Payment History</span></div>
          <div className="nav-item" onClick={() => navigate("/staff-activity")}><img src={activityLogIcon} alt="" /><span>Activity Log</span></div>
        </nav>
      </aside>

      <main className="main-area">
        <header className="top-bar">
          <h2>Appointments</h2>
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
          <div className="calendar-controls">
            <div className="view-toggle">
              <button className={viewMode === 'calendar' ? 'active' : ''} onClick={() => setViewMode('calendar')}>Calendar View</button>
              <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>List View</button>
            </div>
            <button className="add-apt-btn">+ Book Appointment</button>
          </div>

          {viewMode === "calendar" ? (
            <div className="calendar-container">
              <div className="calendar-month-header">
                <h3>February 2026</h3>
                <div className="month-nav">
                  <button>&lt; Prev</button>
                  <button>Next &gt;</button>
                </div>
              </div>
              <div className="calendar-grid">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                  <div key={day} className="weekday-label">{day}</div>
                ))}
                {days.map(d => (
                  <div key={d} className="calendar-day">
                    <span className="day-num">{d}</span>
                    <div className="day-events">
                      {appointments.filter(a => a.day === d).map(apt => (
                        <div key={apt.id} className={`event-item ${apt.status}`}>
                          {apt.time} {apt.petName}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="list-view-container">
               {/* List view table can go here */}
               <p style={{padding: '20px'}}>List View implementation...</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default StaffAppointment;