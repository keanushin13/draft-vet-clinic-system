import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/StaffDashboard.css";
import StaffSidebar from "../../../components/StaffSidebar";
import { useSidebar } from "../../../components/useSidebar";
import { getStaffStats } from "../../../api/api";

// ASSETS
import appointmentIcon from "../../../assets/Appointment_Icon.png";
import bellIcon from "../../../assets/Bell_Icon.png";
import dashboardIcon from "../../../assets/Dashboard_Icon.png";
import inventoryIcon from "../../../assets/Inventory_Icon.png";
import activityLogIcon from "../../../assets/Medical_Icon.png"; // Icon for Activity Log
import messageIcon from "../../../assets/Message_Icon.png";
import pawLogo from "../../../assets/paw.png";
import payHistoryIcon from "../../../assets/payment_icon.png";
import petsProfileIcon from "../../../assets/Pets_Icon.png";
import userIcon from "../../../assets/Profile.png";
import userManagementIcon from "../../../assets/UserManagement_Icon.png";

const StaffDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { isOpen, toggle, close } = useSidebar();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    totalPets: 0,
    pendingPayments: 0,
  });

  useEffect(() => {
    if (!user || user.role !== "staff") {
      navigate("/login");
      return;
    }
    getStaffStats()
      .then((r) => setStats(r.data))
      .catch(() => {});
  }, [navigate, user]);

  return (
    <div className="dashboard-container">
      <StaffSidebar isOpen={isOpen} onClose={close} />

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
          <h2>Welcome, Staff</h2>
          <div className="top-bar-right">
            <button
              className="notif-btn"
              onClick={() => navigate("/staff-notifications")}
            >
              <img src={bellIcon} alt="Notifications" />
            </button>
            <div
              className="user-profile"
              onClick={() => navigate("/staff-profile")}
            >
              <img src={userIcon} alt="User" />
            </div>
          </div>
        </header>

        {/* Empty Content Area - Ready for custom content */}
        <section className="content-body">
          <div className="dashboard-header-action">
            <h3
              style={{
                fontFamily: "Poppins",
                fontWeight: "600",
                marginBottom: "15px",
              }}
            >
              Staff Portal
            </h3>
            <p style={{ color: "#555", marginBottom: "25px" }}>
              Manage clinic operations, view pet profiles, and track activities
              from this central hub.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
              gap: "16px",
              marginTop: "16px",
            }}
          >
            {[
              { label: "Total Appointments", value: stats.totalAppointments },
              { label: "Today's Appointments", value: stats.todayAppointments },
              { label: "Total Pets", value: stats.totalPets },
              { label: "Pending Payments", value: stats.pendingPayments },
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

export default StaffDashboard;
