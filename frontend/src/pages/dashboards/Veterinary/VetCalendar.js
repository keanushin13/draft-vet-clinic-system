import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/VetCalendar.css";
import VetSidebar from "../../../components/VetSidebar";
import { useSidebar } from "../../../components/useSidebar";
import { getAppointments } from "../../../api/api";

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
  const { isOpen, toggle, close } = useSidebar();

  const [appointments, setAppointments] = useState([]);

  // FUNCTION: Security Guard (Matches PetOwner logic)
  useEffect(() => {
    if (!user || user.role !== "veterinarian") {
      navigate("/login");
      return;
    }
    getAppointments()
      .then((r) => setAppointments(r.data))
      .catch(() => {});
  }, [navigate, user]);

  return (
    <div className="dashboard-container">
      <VetSidebar isOpen={isOpen} onClose={close} />

      {/* MAIN CONTENT */}
      <main className="main-area">
        <header className="top-bar">
          <button
            className="hamburger-btn"
            onClick={toggle}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
          <h2>Vet Schedule</h2>
          <div className="top-bar-right">
            <button
              className="notif-btn"
              onClick={() => navigate("/vet-notifications")}
            >
              <img src={bellIcon} alt="Notifications" />
            </button>
            <div
              className="user-profile"
              onClick={() => navigate("/vet-profile")}
            >
              <img src={userIcon} alt="User" />
            </div>
          </div>
        </header>

        <section className="content-body">
          <div className="dashboard-header-action">
            <h3
              style={{
                fontFamily: "Poppins",
                fontWeight: "600",
                marginBottom: "15px",
              }}
            >
              Monthly Schedule
            </h3>
            <p style={{ color: "#555", marginBottom: "25px" }}>
              Manage your clinic appointments and surgeries for this month.
            </p>
          </div>

          <div
            className="calendar-container-card"
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "15px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            }}
          >
            <div
              className="calendar-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <h4 style={{ color: "#255065" }}>February 2026</h4>
              <button
                className="add-apt-btn"
                style={{
                  backgroundColor: "#63b6c5",
                  color: "white",
                  border: "none",
                  padding: "8px 15px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                + Add Appointment
              </button>
            </div>

            {/* Simplified Grid to represent the calendar UI */}
            <div
              className="calendar-grid-placeholder"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "10px",
              }}
            >
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  style={{
                    textAlign: "center",
                    fontWeight: "600",
                    color: "#438fb5",
                    paddingBottom: "10px",
                  }}
                >
                  {day}
                </div>
              ))}
              {Array.from({ length: 28 }).map((_, i) => {
                const dayApts = appointments.filter(
                  (a) => new Date(a.scheduledAt).getDate() === i + 1,
                );
                return (
                  <div
                    key={i}
                    style={{
                      height: "80px",
                      border: "1px solid #edf2f7",
                      borderRadius: "8px",
                      padding: "5px",
                      fontSize: "12px",
                      color: "#888",
                    }}
                  >
                    {i + 1}
                    {dayApts.map((a) => (
                      <div
                        key={a.id}
                        style={{
                          background: "#c9eaf7",
                          color: "#255065",
                          padding: "2px",
                          borderRadius: "4px",
                          marginTop: "5px",
                          fontSize: "10px",
                        }}
                      >
                        {a.pet?.name}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default VetCalendar;
