import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/StaffAppointment.css";

// ASSETS
import appointmentIcon from "../../assets/Appointment_Icon.png";
import bellIcon from "../../assets/Bell_Icon.png";
import dashboardIcon from "../../assets/Dashboard_Icon.png";
import inventoryIcon from "../../assets/Inventory_Icon.png";
import activityLogIcon from "../../assets/Medical_Icon.png";
import messageIcon from "../../assets/Message_Icon.png";
import pawLogo from "../../assets/paw.png";
import payHistoryIcon from "../../assets/payment_icon.png";
import petsProfileIcon from "../../assets/Pets_Icon.png";
import userIcon from "../../assets/User_Icon.png";
import userManagementIcon from "../../assets/UserManagement_Icon.png";

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
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={pawLogo} alt="Logo" className="nav-logo" />
          <span>PawCruz</span>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-item" onClick={() => navigate("/staff")}><img src={dashboardIcon} className="nav-icon" alt="" /><span>Dashboard</span></div>
          <div className="nav-item active" onClick={() => navigate("/staff-appointments")}><img src={appointmentIcon} className="nav-icon" alt="" /><span>Appointment</span></div>
          <div className="nav-item" onClick={() => navigate("/staff-users")}><img src={userManagementIcon} className="nav-icon" alt="" /><span>User Management</span></div>
          <div className="nav-item" onClick={() => navigate("/staff-pets")}><img src={petsProfileIcon} className="nav-icon" alt="" /><span>Pets Profile</span></div>
          <div className="nav-item" onClick={() => navigate("/staff-messages")}><img src={messageIcon} className="nav-icon" alt="" /><span>Messages</span></div>
          <div className="nav-item" onClick={() => navigate("/staff-inventory")}><img src={inventoryIcon} className="nav-icon" alt="" /><span>Inventory</span></div>
          <div className="nav-item" onClick={() => navigate("/staff-payments")}><img src={payHistoryIcon} className="nav-icon" alt="" /><span>Payment History</span></div>
          <div className="nav-item" onClick={() => navigate("/staff-activity")}><img src={activityLogIcon} className="nav-icon" alt="" /><span>Activity Log</span></div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-area">
        <header className="top-bar">
          <h2>Appointments</h2>
          <div className="top-bar-right">
            <button className="notif-btn" onClick={() => navigate("/staff-notifications")}>
              <img src={bellIcon} alt="Notif" className="top-icon" />
            </button>
            <div className="user-profile" onClick={() => navigate("/staff-profile")}>
              <img src={userIcon} alt="Profile" className="top-avatar" />
            </div>
          </div>
        </header>

        <section className="dashboard-scroll-body">
          <div className="calendar-controls">
            <div className="view-toggle">
              <button className={`toggle-btn ${viewMode === 'calendar' ? 'active' : ''}`} onClick={() => setViewMode('calendar')}>Calendar View</button>
              <button className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>List View</button>
            </div>
            <button className="add-apt-btn-rect">+ Book Appointment</button>
          </div>

          {viewMode === "calendar" ? (
            <div className="calendar-card">
              <div className="calendar-month-header">
                <h3>February 2026</h3>
                <div className="month-nav">
                  <button className="nav-arrow">&lt;</button>
                  <button className="nav-arrow">&gt;</button>
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
                          <span className="event-time">{apt.time}</span>
                          <span className="event-pet">{apt.petName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="list-view-container">
              <div className="user-table-container">
                <table className="user-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Pet Name</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map(apt => (
                      <tr key={apt.id}>
                        <td>{apt.time}</td>
                        <td className="item-name-bold">{apt.petName}</td>
                        <td><span className={`status-badge ${apt.status}`}>{apt.status}</span></td>
                        <td><button className="btn-view-small">Manage</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default StaffAppointment;