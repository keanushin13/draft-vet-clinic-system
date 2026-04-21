import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../../css/PetOwnerProfile.css";
import PetOwnerSidebar from "../../../components/PetOwnerSidebar";
import { useSidebar } from "../../../components/useSidebar";
import { getMe } from "../../../api/api";

// ASSETS
import appointmentIcon from "../../../assets/Appointment_Icon.png";
import bellIcon from "../../../assets/Bell_Icon.png";
import dashboardIcon from "../../../assets/Dashboard_Icon.png";
import medicalIcon from "../../../assets/Medical_Icon.png";
import messageIcon from "../../../assets/Message_Icon.png";
import pawLogo from "../../../assets/paw.png";
import paymentIcon from "../../../assets/payment_icon.png";
import petsIcon from "../../../assets/Pets_Icon.png";
import userIcon from "../../../assets/Profile.png";

const PetOwnerProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const localUser = JSON.parse(localStorage.getItem("user"));
  const { isOpen, toggle, close } = useSidebar();
  const [profile, setProfile] = useState(localUser);

  useEffect(() => {
    if (!localUser || localUser.role !== "pet_owner") {
      navigate("/login");
      return;
    }
    getMe()
      .then((r) => setProfile(r.data))
      .catch(() => {});
  }, [navigate]);

  const handleLogout = () => {
    // Clear local storage to end session
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // Redirect to login page
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <PetOwnerSidebar isOpen={isOpen} onClose={close} />

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
          <h2>My Profile</h2>
          <div className="top-bar-right">
            <button
              className="notif-btn"
              onClick={() => navigate("/pet-owner-notifications")}
            >
              <img src={bellIcon} alt="Notifications" />
            </button>
            <div
              className="user-profile"
              onClick={() => navigate("/pet-owner-profile")}
            >
              <img src={userIcon} alt="User" />
            </div>
          </div>
        </header>

        <section className="content-body">
          <div className="dashboard-welcome-card">
            <h3>Profile Information</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginTop: "12px",
              }}
            >
              <div>
                <label style={{ color: "#888", fontSize: "0.8rem" }}>
                  Full Name
                </label>
                <p style={{ color: "#255065", fontWeight: "600" }}>
                  {profile?.firstName
                    ? `${profile.firstName} ${profile.lastName}`
                    : profile?.username || "N/A"}
                </p>
              </div>
              <div>
                <label style={{ color: "#888", fontSize: "0.8rem" }}>
                  Email
                </label>
                <p>{profile?.email}</p>
              </div>
              <div>
                <label style={{ color: "#888", fontSize: "0.8rem" }}>
                  Phone
                </label>
                <p>{profile?.phone || "N/A"}</p>
              </div>
              <div>
                <label style={{ color: "#888", fontSize: "0.8rem" }}>
                  Username
                </label>
                <p>{profile?.username}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PetOwnerProfile;
