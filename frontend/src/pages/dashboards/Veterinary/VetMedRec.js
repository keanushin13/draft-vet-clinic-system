import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/VetMedRec.css";
import VetSidebar from "../../../components/VetSidebar";
import { useSidebar } from "../../../components/useSidebar";
import { getMedicalRecords } from "../../../api/api";

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

const VetMedRec = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { isOpen, toggle, close } = useSidebar();

  const [records, setRecords] = useState([]);

  useEffect(() => {
    if (!user || user.role !== "veterinarian") {
      navigate("/login");
      return;
    }
    getMedicalRecords()
      .then((r) => setRecords(r.data))
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
          <h2>Clinical Medical Records</h2>
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
              Patient History Management
            </h3>
            <p style={{ color: "#555", marginBottom: "25px" }}>
              Search, view, and update the medical records for all clinic
              patients.
            </p>
          </div>

          <div
            className="records-list-card"
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "15px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            }}
          >
            <div
              className="records-filters"
              style={{ marginBottom: "20px", display: "flex", gap: "10px" }}
            >
              <input
                type="text"
                placeholder="Search by Patient ID or Name..."
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
              <button
                style={{
                  backgroundColor: "#255065",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                New Entry
              </button>
            </div>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead>
                <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                  <th style={{ padding: "15px", color: "#63b6c5" }}>
                    Record ID
                  </th>
                  <th style={{ padding: "15px", color: "#63b6c5" }}>Patient</th>
                  <th style={{ padding: "15px", color: "#63b6c5" }}>Date</th>
                  <th style={{ padding: "15px", color: "#63b6c5" }}>
                    Diagnosis
                  </th>
                  <th style={{ padding: "15px", color: "#63b6c5" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec) => (
                  <tr
                    key={rec.id}
                    style={{
                      borderBottom: "1px solid #f9f9f9",
                      cursor: "pointer",
                    }}
                  >
                    <td
                      style={{
                        padding: "15px",
                        fontWeight: "500",
                        color: "#255065",
                      }}
                    >
                      REC-{String(rec.id).padStart(3, "0")}
                    </td>
                    <td style={{ padding: "15px" }}>
                      {rec.pet?.name} <br />
                      <small style={{ color: "#888" }}>
                        {rec.pet?.owner
                          ? `${rec.pet.owner.firstName ?? ""} ${rec.pet.owner.lastName ?? ""}`.trim() ||
                            rec.pet.owner.username
                          : ""}
                      </small>
                    </td>
                    <td style={{ padding: "15px" }}>
                      {new Date(rec.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "15px" }}>{rec.diagnosis}</td>
                    <td style={{ padding: "15px" }}>
                      <span
                        style={{
                          padding: "5px 12px",
                          borderRadius: "20px",
                          fontSize: "11px",
                          fontWeight: "500",
                          backgroundColor:
                            rec.status === "Finalized" ? "#e0f2f1" : "#fff3e0",
                          color:
                            rec.status === "Finalized" ? "#00695c" : "#ef6c00",
                        }}
                      >
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default VetMedRec;
