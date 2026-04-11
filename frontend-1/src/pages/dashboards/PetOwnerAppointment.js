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
import userIcon from "../../assets/Profile.png";

const PetOwnerAppointment = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [viewMode, setViewMode] = useState("calendar");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const [appointments, setAppointments] = useState(() => {
    const savedAppointments = localStorage.getItem("petOwnerAppointments");
    return savedAppointments
      ? JSON.parse(savedAppointments)
      : [
          {
            id: 1,
            petName: "Bella",
            day: 10,
            time: "09:00 AM",
            status: "confirmed",
            vet: "Dr. Sarah Dela Cruz",
            reason: "Vaccination",
            paymentMethod: "GCash",
            paymentReference: "GC12345678"
          },
          {
            id: 2,
            petName: "Max",
            day: 15,
            time: "02:00 PM",
            status: "confirmed",
            vet: "Dr. Michael Cruz",
            reason: "Skin check-up",
            paymentMethod: "Cash",
            paymentReference: "Walk-in Payment"
          }
        ];
  });

  const [formData, setFormData] = useState({
    petName: "",
    day: "",
    time: "",
    vet: "",
    reason: ""
  });

  const [paymentData, setPaymentData] = useState({
    method: "",
    reference: ""
  });

  const consultationFee = 500;
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  useEffect(() => {
    if (!user || user.role !== "pet_owner") {
      navigate("/login");
    }
  }, [navigate, user]);

  useEffect(() => {
    localStorage.setItem("petOwnerAppointments", JSON.stringify(appointments));
  }, [appointments]);

  const openModal = () => {
    setFormData({
      petName: "",
      day: "",
      time: "",
      vet: "",
      reason: ""
    });
    setPaymentData({
      method: "",
      reference: ""
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closePaymentModal = () => {
    setIsPaymentOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProceedToPayment = () => {
    if (
      !formData.petName ||
      !formData.day ||
      !formData.time ||
      !formData.vet ||
      !formData.reason
    ) {
      alert("Please complete all appointment details first.");
      return;
    }

    setIsModalOpen(false);
    setIsPaymentOpen(true);
  };

  const handleConfirmPayment = () => {
    if (!paymentData.method || !paymentData.reference) {
      alert("Please complete your payment details.");
      return;
    }

    const newAppointment = {
      id: Date.now(),
      petName: formData.petName,
      day: Number(formData.day),
      time: formData.time,
      vet: formData.vet,
      reason: formData.reason,
      status: "confirmed",
      paymentMethod: paymentData.method,
      paymentReference: paymentData.reference
    };

    setAppointments((prev) => [...prev, newAppointment]);

    setFormData({
      petName: "",
      day: "",
      time: "",
      vet: "",
      reason: ""
    });

    setPaymentData({
      method: "",
      reference: ""
    });

    setIsPaymentOpen(false);
    alert("Appointment booked and payment confirmed successfully.");
  };

  const handleCancelAppointment = (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (confirmCancel) {
      setAppointments((prev) => prev.filter((apt) => apt.id !== id));
    }
  };

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
            <img src={dashboardIcon} alt="Dashboard" className="nav-icon" />
            <span>Dashboard</span>
          </div>

          <div
            className="nav-item active"
            onClick={() => navigate("/pet-owner-appointments")}
          >
            <img
              src={appointmentIcon}
              alt="Appointment"
              className="nav-icon"
            />
            <span>Appointment</span>
          </div>

          <div className="nav-item" onClick={() => navigate("/pet-owner-pets")}>
            <img src={petsIcon} alt="My Pets" className="nav-icon" />
            <span>My Pets</span>
          </div>

          <div
            className="nav-item"
            onClick={() => navigate("/pet-owner-messages")}
          >
            <img src={messageIcon} alt="Messages" className="nav-icon" />
            <span>Messages</span>
          </div>

          <div
            className="nav-item"
            onClick={() => navigate("/pet-owner-records")}
          >
            <img
              src={medicalIcon}
              alt="Medical Records"
              className="nav-icon"
            />
            <span>Medical Records</span>
          </div>

          <div
            className="nav-item"
            onClick={() => navigate("/pet-owner-payments")}
          >
            <img
              src={paymentIcon}
              alt="Payment History"
              className="nav-icon"
            />
            <span>Payment History</span>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-area">
        <header className="top-bar">
          <h2>Appointments</h2>
          <div className="top-bar-right">
            <button
              type="button"
              className="notif-btn"
              onClick={() => navigate("/pet-owner-notifications")}
            >
              <img src={bellIcon} alt="Notifications" className="top-icon" />
            </button>
            <div
              className="user-profile"
              onClick={() => navigate("/pet-owner-profile")}
            >
              <img src={userIcon} alt="User" className="top-avatar" />
            </div>
          </div>
        </header>

        <section className="dashboard-scroll-body">
          <div className="appointment-header-action">
            <div className="toggle-group">
              <button
                type="button"
                className={`toggle-btn ${viewMode === "calendar" ? "active" : ""}`}
                onClick={() => setViewMode("calendar")}
              >
                Calendar View
              </button>
              <button
                type="button"
                className={`toggle-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
              >
                List View
              </button>
            </div>

            <button type="button" className="book-btn-rect" onClick={openModal}>
              + Book New Appointment
            </button>
          </div>

          {viewMode === "calendar" ? (
            <div className="calendar-card">
              <div className="calendar-month-header">
                <h3>September 2025</h3>
                <div className="month-nav">
                  <button type="button" className="nav-arrow">
                    &lt;
                  </button>
                  <button type="button" className="nav-arrow">
                    &gt;
                  </button>
                </div>
              </div>

              <div className="calendar-grid">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="weekday-label">
                    {day}
                  </div>
                ))}

                {days.map((d) => (
                  <div key={d} className="calendar-day">
                    <span className="day-num">{d}</span>
                    <div className="day-events">
                      {appointments
                        .filter((a) => a.day === d)
                        .map((apt) => (
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
                      <th>Reason</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((apt) => (
                      <tr key={apt.id}>
                        <td>
                          Sep {apt.day}, 2025 - {apt.time}
                        </td>
                        <td className="bold-txt">{apt.petName}</td>
                        <td>{apt.vet}</td>
                        <td>{apt.reason}</td>
                        <td>{apt.paymentMethod}</td>
                        <td>
                          <span className={`status-tag ${apt.status}`}>
                            {apt.status}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => handleCancelAppointment(apt.id)}
                          >
                            Cancel
                          </button>
                        </td>
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

      {/* BOOK APPOINTMENT MODAL */}
      {isModalOpen && (
        <div className="appointment-modal">
          <div className="appointment-modal-content">
            <h3>Book New Appointment</h3>

            <div className="appointment-form-group">
              <label>Pet Name</label>
              <select
                name="petName"
                value={formData.petName}
                onChange={handleChange}
              >
                <option value="">Select Pet</option>
                <option value="Bella">Bella</option>
                <option value="Max">Max</option>
              </select>
            </div>

            <div className="appointment-form-group">
              <label>Appointment Day</label>
              <select name="day" value={formData.day} onChange={handleChange}>
                <option value="">Select Day</option>
                {days.map((day) => (
                  <option key={day} value={day}>
                    September {day}, 2025
                  </option>
                ))}
              </select>
            </div>

            <div className="appointment-form-group">
              <label>Time</label>
              <select name="time" value={formData.time} onChange={handleChange}>
                <option value="">Select Time</option>
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="01:00 PM">01:00 PM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:00 PM">03:00 PM</option>
              </select>
            </div>

            <div className="appointment-form-group">
              <label>Veterinarian</label>
              <select name="vet" value={formData.vet} onChange={handleChange}>
                <option value="">Select Veterinarian</option>
                <option value="Dr. Sarah Dela Cruz">Dr. Sarah Dela Cruz</option>
                <option value="Dr. Michael Cruz">Dr. Michael Cruz</option>
              </select>
            </div>

            <div className="appointment-form-group">
              <label>Reason for Visit</label>
              <input
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
              />
            </div>

            <div className="appointment-modal-actions">
              <button
                type="button"
                className="book-btn-rect"
                onClick={handleProceedToPayment}
              >
                Proceed to Payment
              </button>
              <button
                type="button"
                className="cancel-btn-alt"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT MODAL */}
      {isPaymentOpen && (
        <div className="appointment-modal">
          <div className="appointment-modal-content">
            <h3>Appointment Payment</h3>

            <div className="payment-summary-box">
              <p><strong>Pet:</strong> {formData.petName}</p>
              <p><strong>Date:</strong> September {formData.day}, 2025</p>
              <p><strong>Time:</strong> {formData.time}</p>
              <p><strong>Veterinarian:</strong> {formData.vet}</p>
              <p><strong>Fee:</strong> â‚±{consultationFee}</p>
            </div>

            <div className="appointment-form-group">
              <label>Payment Method</label>
              <select
                name="method"
                value={paymentData.method}
                onChange={handlePaymentChange}
              >
                <option value="">Select Payment Method</option>
                <option value="GCash">GCash</option>
                <option value="Maya">Maya</option>
                <option value="Debit/Credit Card">Debit/Credit Card</option>
                <option value="Cash">Cash</option>
              </select>
            </div>

            <div className="appointment-form-group">
              <label>
                {paymentData.method === "Debit/Credit Card"
                  ? "Card Number"
                  : paymentData.method === "Cash"
                  ? "Payment Note"
                  : "Reference Number"}
              </label>
              <input
                type="text"
                name="reference"
                value={paymentData.reference}
                onChange={handlePaymentChange}
                placeholder={
                  paymentData.method === "Cash"
                    ? "Enter cash payment note"
                    : "Enter payment reference"
                }
              />
            </div>

            <div className="appointment-modal-actions">
              <button
                type="button"
                className="book-btn-rect"
                onClick={handleConfirmPayment}
              >
                Pay & Confirm
              </button>
              <button
                type="button"
                className="cancel-btn-alt"
                onClick={closePaymentModal}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetOwnerAppointment;