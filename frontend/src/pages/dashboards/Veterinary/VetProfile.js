import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/VetProfile.css";
import VetSidebar from "../../../components/VetSidebar";
import { useSidebar } from "../../../components/useSidebar";
import { getMe } from "../../../api/api";

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

const VetProfile = () => {
  const navigate = useNavigate();
  const localUser = JSON.parse(localStorage.getItem("user"));
  const { isOpen, toggle, close } = useSidebar();
  const [profile, setProfile] = useState(localUser);

  // FUNCTION: Guard Clause
  useEffect(() => {
    if (!localUser || localUser.role !== "veterinarian") {
      navigate("/login");
      return;
    }
    getMe()
      .then((r) => setProfile(r.data))
      .catch(() => {});
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

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
          <h2>My Profile</h2>
          <div className="top-bar-right">
            <button
              className="notif-btn"
              onClick={() => navigate("/vet-notifications")}
            >
              <img src={bellIcon} alt="Notifications" />
            </button>
            <div className="user-profile active">
              <img src={userIcon} alt="User" />
            </div>
          </div>
        </header>

        <section className="content-body">
          <div className="profile-container-card">
            <div className="profile-header-section">
              <div className="profile-avatar-large">
                <img src={userIcon} alt="Avatar" />
              </div>
              <div className="profile-intro">
                <h3>
                  Dr.{" "}
                  {profile?.firstName || profile?.username || "Veterinarian"}
                </h3>
                <p className="role-badge">Verified Veterinarian</p>
              </div>
            </div>

            <div className="profile-details-grid">
              <div className="detail-group">
                <label>Full Name</label>
                <p>
                  {profile?.firstName
                    ? `${profile.firstName} ${profile.lastName}`
                    : profile?.username || "Not Set"}
                </p>
              </div>
              <div className="detail-group">
                <label>Email Address</label>
                <p>{profile?.email || "Not Set"}</p>
              </div>
              <div className="detail-group">
                <label>Username</label>
                <p>{profile?.username}</p>
              </div>
              <div className="detail-group">
                <label>Clinic Role</label>
                <p style={{ textTransform: "capitalize" }}>{profile?.role}</p>
              </div>
            </div>

            <div className="profile-actions">
              <button className="edit-profile-btn">Edit Details</button>
              <button className="logout-btn" onClick={handleLogout}>
                Logout Account
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default VetProfile;
