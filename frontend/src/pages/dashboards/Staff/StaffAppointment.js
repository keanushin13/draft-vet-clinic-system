import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/StaffAppointment.css";
import StaffSidebar from "../../../components/StaffSidebar";
import { useSidebar } from "../../../components/useSidebar";

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
import userIcon from "../../../assets/Profile.png";
import userManagementIcon from "../../../assets/UserManagement_Icon.png";

const StaffAppointment = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { isOpen, toggle, close } = useSidebar();
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
            <StaffSidebar isOpen={isOpen} onClose={close} />

      <main className="main-area">
        <header className="top-bar">
          <button className="hamburger-btn" onClick={toggle} aria-label="Toggle menu"><span /><span /><span /></button>
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