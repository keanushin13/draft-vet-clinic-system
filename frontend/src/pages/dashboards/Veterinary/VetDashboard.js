import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/VetDashboard.css";
import VetSidebar from "../../../components/VetSidebar";
import { useSidebar } from "../../../components/useSidebar";
import { getVetStats } from "../../../api/api";

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

const VetDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { isOpen, toggle, close } = useSidebar();

  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    totalRecords: 0,
  });

  // FUNCTION: Guard Clause (Matches PetOwner logic)
  useEffect(() => {
    if (!user || user.role !== "veterinarian") {
      navigate("/login");
      return;
    }
    getVetStats()
      .then((r) => setStats(r.data))
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          {/* Functional Greeting: Matches user.name || 'Doctor' pattern */}
          <h2>
            Welcome, Dr. {user?.firstName || user?.username || "Veterinarian"}
          </h2>
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
              Clinic Management
            </h3>
            <p style={{ color: "#555", marginBottom: "25px" }}>
              Welcome to the Veterinary portal. Access patient histories and
              daily schedules here.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
              gap: "16px",
              marginTop: "16px",
            }}
          >
            {[
              { label: "Total Patients", value: stats.totalPatients },
              { label: "Today's Appointments", value: stats.todayAppointments },
              { label: "Medical Records", value: stats.totalRecords },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: "700",
                    color: "#255065",
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    color: "#666",
                    fontSize: "0.85rem",
                    marginTop: "4px",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default VetDashboard;
