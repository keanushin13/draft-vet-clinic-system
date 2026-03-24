import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/PetOwnerMedRec.css";

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

const PetOwnerMedRec = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [selectedPet, setSelectedPet] = useState("All Pets");
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [records] = useState([
    {
      id: 1,
      petName: "Bella",
      date: "Jan 12, 2026",
      type: "Vaccination",
      description: "Anti-Rabies Shot",
      vet: "Dr. Sarah Dela Cruz"
    },
    {
      id: 2,
      petName: "Max",
      date: "Jan 05, 2026",
      type: "Check-up",
      description: "Annual Physical Examination",
      vet: "Dr. Michael Cruz"
    },
    {
      id: 3,
      petName: "Bella",
      date: "Dec 20, 2025",
      type: "Deworming",
      description: "General Deworming (Tablet)",
      vet: "Dr. Sarah Dela Cruz"
    }
  ]);

  useEffect(() => {
    if (!user || user.role !== "pet_owner") {
      navigate("/login");
    }
  }, [navigate, user]);

  const filteredRecords =
    selectedPet === "All Pets"
      ? records
      : records.filter((r) => r.petName === selectedPet);

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
            className="nav-item"
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
            className="nav-item active"
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
          <h2>Medical Records</h2>
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
          <div className="medrec-header-action">
            <div className="filter-group">
              <span className="filter-label">Filter by Pet:</span>
              <select
                className="pet-select"
                value={selectedPet}
                onChange={(e) => setSelectedPet(e.target.value)}
              >
                <option value="All Pets">All Pets</option>
                <option value="Bella">Bella</option>
                <option value="Max">Max</option>
              </select>
            </div>

            <button type="button" className="download-btn-rect">
              Download Full History
            </button>
          </div>

          <div className="records-container">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <div key={record.id} className="record-card">
                  <div className="record-date-side">
                    <span className="record-date">{record.date}</span>
                    <span className="record-type-badge">{record.type}</span>
                  </div>

                  <div className="record-details-side">
                    <div className="record-main-info">
                      <h4>{record.description}</h4>
                      <p className="record-pet-tag">
                        <img
                          src={petsIcon}
                          className="tiny-icon"
                          alt="Pet"
                        />
                        {record.petName}
                      </p>
                    </div>

                    <div className="record-vet-info">
                      <p className="vet-name">{record.vet}</p>
                      <small>Attending Veterinarian</small>
                    </div>

                    <button
                      type="button"
                      className="view-doc-btn"
                      onClick={() => setSelectedRecord(record)}
                    >
                      View Result
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="dashboard-welcome-card empty-state">
                <img
                  src={medicalIcon}
                  alt="No records"
                  className="large-faded-icon"
                />
                <p>No medical records found for this pet.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* VIEW RESULT MODAL */}
      {selectedRecord && (
        <div className="pet-modal">
          <div className="pet-modal-content">
            <h3>Medical Record Details</h3>

            <div className="form-group">
              <label>Pet Name</label>
              <p>{selectedRecord.petName}</p>
            </div>

            <div className="form-group">
              <label>Date</label>
              <p>{selectedRecord.date}</p>
            </div>

            <div className="form-group">
              <label>Record Type</label>
              <p>{selectedRecord.type}</p>
            </div>

            <div className="form-group">
              <label>Description</label>
              <p>{selectedRecord.description}</p>
            </div>

            <div className="form-group">
              <label>Veterinarian</label>
              <p>{selectedRecord.vet}</p>
            </div>

            <div className="modal-action-row">
              <button
                type="button"
                className="add-pet-btn-rect"
                onClick={() => setSelectedRecord(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetOwnerMedRec;