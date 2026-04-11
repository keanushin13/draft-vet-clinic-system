import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/VetCalendar.css";

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

const VetCalendar = () => {
  const navigate = useNavigate();

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const [appointments, setAppointments] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("vetAppointments") || "null");
      if (Array.isArray(saved) && saved.length > 0) {
        return saved;
      }
    } catch {
      // ignore
    }

    return [
      { id: 1, day: 14, title: "Surgery: Max", time: "10:00 AM", type: "Surgery" },
      { id: 2, day: 18, title: "Checkup: Luna", time: "1:00 PM", type: "Checkup" },
      { id: 3, day: 22, title: "Vaccination: Cooper", time: "3:30 PM", type: "Vaccination" },
      { id: 4, day: 25, title: "Consultation: Bella", time: "9:00 AM", type: "Consultation" },
    ];
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    petName: "",
    type: "",
    time: "",
    day: "",
  });

  useEffect(() => {
    if (!user || user.role !== "veterinarian") {
      navigate("/login");
    }
  }, [navigate, user]);

  useEffect(() => {
    localStorage.setItem("vetAppointments", JSON.stringify(appointments));
  }, [appointments]);

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const openAddModal = () => {
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setFormData({
      petName: "",
      type: "",
      time: "",
      day: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatTimeTo12Hour = (time24) => {
    if (!time24) return "";
    const [hourStr, minute] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const suffix = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${suffix}`;
  };

  const handleAddAppointment = (e) => {
    e.preventDefault();

    const petName = formData.petName.trim();
    const type = formData.type.trim();
    const day = Number(formData.day);
    const time = formData.time;

    if (!petName || !type || !day || !time) {
      alert("Please fill in all fields.");
      return;
    }

    if (day < 1 || day > 28) {
      alert("Please enter a valid day between 1 and 28.");
      return;
    }

    const newAppointment = {
      id: Date.now(),
      day,
      title: `${type}: ${petName}`,
      time: formatTimeTo12Hour(time),
      type,
    };

    setAppointments((prev) =>
      [...prev, newAppointment].sort((a, b) => {
        if (a.day !== b.day) return a.day - b.day;
        return a.time.localeCompare(b.time);
      })
    );

    closeAddModal();
  };

  const appointmentCount = appointments.length;
  const surgeryCount = appointments.filter((a) => a.type.toLowerCase() === "surgery").length;
  const followupCount = appointments.filter((a) =>
    a.type.toLowerCase().includes("follow")
  ).length;

  return (
    <div className="dashboard-container">
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

      <main className="main-area">
        <header className="top-bar">
          <div>
            <h2>Vet Schedule</h2>
            <p className="top-subtitle">Track appointments, surgeries, and consultations</p>
          </div>

          <div className="top-bar-right">
            <button
              type="button"
              className="notif-btn"
              onClick={() => navigate("/vet-notifications")}
            >
              <img src={bellIcon} alt="Notifications" />
            </button>

            <button
              type="button"
              className="user-profile"
              onClick={() => navigate("/vet-profile")}
            >
              <img src={userIcon} alt="User" />
            </button>
          </div>
        </header>

        <section className="content-body">
          <div className="calendar-container-card">
            <div className="calendar-header">
              <div>
                <p className="calendar-label">Monthly View</p>
                <h3 className="calendar-title">February 2026</h3>
                <p className="calendar-subtitle">
                  Organize clinic visits and monitor scheduled procedures
                </p>
              </div>

              <div className="calendar-actions">
                <button type="button" className="month-btn">
                  â†
                </button>
                <button type="button" className="month-btn">
                  â†’
                </button>
                <button type="button" className="add-apt-btn" onClick={openAddModal}>
                  + Add Appointment
                </button>
              </div>
            </div>

            <div className="calendar-summary-row">
              <div className="summary-card">
                <span className="summary-number">{appointmentCount}</span>
                <span className="summary-label">Appointments</span>
              </div>
              <div className="summary-card">
                <span className="summary-number">{surgeryCount}</span>
                <span className="summary-label">Surgeries</span>
              </div>
              <div className="summary-card">
                <span className="summary-number">{followupCount}</span>
                <span className="summary-label">Follow-ups</span>
              </div>
            </div>

            <div className="calendar-grid-wrapper">
              <div className="calendar-grid">
                {weekDays.map((day) => (
                  <div key={day} className="calendar-day-name">
                    {day}
                  </div>
                ))}

                {Array.from({ length: 28 }).map((_, i) => {
                  const currentDay = i + 1;
                  const dayAppointments = appointments.filter(
                    (appointment) => appointment.day === currentDay
                  );

                  return (
                    <div key={currentDay} className="calendar-day-box">
                      <div className="calendar-day-number">{currentDay}</div>

                      <div className="calendar-events">
                        {dayAppointments.map((appointment) => (
                          <div key={appointment.id} className="calendar-event">
                            <span className="event-title">{appointment.title}</span>
                            <span className="event-time">{appointment.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {showAddModal && (
          <div className="modal-overlay" onClick={closeAddModal}>
            <div className="add-appointment-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Add Appointment</h3>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={closeAddModal}
                >
                  Ã—
                </button>
              </div>

              <form className="appointment-form" onSubmit={handleAddAppointment}>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="petName">Pet Name</label>
                    <input
                      id="petName"
                      name="petName"
                      type="text"
                      placeholder="Enter pet name"
                      value={formData.petName}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="type">Appointment Type</label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                    >
                      <option value="">Select type</option>
                      <option value="Checkup">Checkup</option>
                      <option value="Vaccination">Vaccination</option>
                      <option value="Consultation">Consultation</option>
                      <option value="Surgery">Surgery</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Deworming">Deworming</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="day">Day of Month</label>
                    <input
                      id="day"
                      name="day"
                      type="number"
                      min="1"
                      max="28"
                      placeholder="1 to 28"
                      value={formData.day}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="time">Time</label>
                    <input
                      id="time"
                      name="time"
                      type="time"
                      value={formData.time}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={closeAddModal}>
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    Save Appointment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default VetCalendar;