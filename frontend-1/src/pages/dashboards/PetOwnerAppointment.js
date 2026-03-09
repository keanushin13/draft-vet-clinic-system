import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/PetOwnerAppointment.css";

// ASSETS
import appointmentIcon from "../../assets/Appointment_Icon.png";
import bellIcon from "../../assets/Bell_Icon.png";
import dashboardIcon from "../../assets/Dashboard_Icon.png";
import medicalIcon from "../../assets/Medical_Icon.png";
import messageIcon from "../../assets/Message_Icon.png";
import pawLogo from "../../assets/paw.png";
import paymentIcon from "../../assets/payment_icon.png";
import petsIcon from "../../assets/Pets_Icon.png";
import userIcon from "../../assets/User_Icon.png";

const PetOwnerAppointment = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [viewMode, setViewMode] = useState("calendar");

  // Mock data for appointments
  const [appointments] = useState([
    { id: 1, petName: "Bella", day: 10, time: "09:00 AM", status: "confirmed", vet: "Dr. Sarah Dela Cruz" },
    { id: 2, petName: "Max", day: 15, time: "02:00 PM", status: "pending", vet: "Dr. Micheal Cruz" },
  ]);

  const days = Array.from({ length: 28 }, (_, i) => i + 1);

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
          <div className="nav-item" onClick={() => navigate("/pet-owner")}>
            <img src={dashboardIcon} alt="" className="nav-icon" />
            <span>Dashboard</span>
          </div>
          
          <div className="nav-item active" onClick={() => navigate("/pet-owner-appointments")}>
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
          <h2>Appointments</h2>
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
            <div className="appointment-header-action">
                <div className="toggle-group">
                  <button className={`toggle-btn ${viewMode === 'calendar' ? 'active' : ''}`} onClick={() => setViewMode('calendar')}>Calendar View</button>
                  <button className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>List View</button>
                </div>
                <button className="book-btn-rect">+ Book New Appointment</button>
            </div>
            
            {viewMode === "calendar" ? (
              <div className="calendar-card">
                <div className="calendar-month-header">
                  <h3>September 2025</h3>
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
                          <div key={apt.id} className={`event-badge ${apt.status}`}>
                            {apt.petName}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="list-view-card">
                {appointments.length > 0 ? (
                  <table className="apt-table">
                    <thead>
                      <tr>
                        <th>Date & Time</th>
                        <th>Pet</th>
                        <th>Veterinarian</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map(apt => (
                        <tr key={apt.id}>
                          <td>Sep {apt.day}, 2025 - {apt.time}</td>
                          <td className="bold-txt">{apt.petName}</td>
                          <td>{apt.vet}</td>
                          <td><span className={`status-tag ${apt.status}`}>{apt.status}</span></td>
                          <td><button className="cancel-btn">Cancel</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="empty-state">
                    <p>No appointments found. Start by booking your first visit!</p>
                  </div>
                )}
              </div>
            )}
        </section>
      </main>
    </div>
  );
};

export default PetOwnerAppointment;