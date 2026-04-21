import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/StaffProfile.css";
import StaffSidebar from "../../../components/StaffSidebar";
import { useSidebar } from "../../../components/useSidebar";
import { getMe } from "../../../api/api";

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

const StaffProfile = () => {
  const navigate = useNavigate();
  const localUser = JSON.parse(localStorage.getItem("user"));
  const { isOpen, toggle, close } = useSidebar();
  const [profile, setProfile] = useState(localUser);

  useEffect(() => {
    if (!localUser || localUser.role !== "staff") {
      navigate("/login");
      return;
    }
    getMe()
      .then((r) => setProfile(r.data))
      .catch(() => {});
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <StaffSidebar isOpen={isOpen} onClose={close} />

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
              onClick={() => navigate("/staff-notifications")}
            >
              <img src={bellIcon} alt="Notif" />
            </button>
            <div className="user-profile active">
              <img src={userIcon} alt="Profile" />
            </div>
          </div>
        </header>

        <section className="content-body">
          <div className="profile-container">
            {/* PROFILE HEADER */}
            <div className="profile-header-card">
              <div className="profile-banner"></div>
              <div className="profile-info-main">
                <div className="profile-avatar-wrapper">
                  <img src={userIcon} alt="Avatar" />
                </div>
                <div className="profile-title">
                  <h3>
                    {profile?.firstName
                      ? `${profile.firstName} ${profile.lastName}`
                      : profile?.username || "Staff Member"}
                  </h3>
                  <p>Clinic Administrator / Staff</p>
                </div>
                <button className="edit-profile-btn">Edit Profile</button>
              </div>
            </div>

            {/* DETAILS GRID */}
            <div className="profile-details-grid">
              <div className="details-card">
                <h4>Personal Information</h4>
                <div className="info-row">
                  <label>Full Name</label>
                  <span>
                    {profile?.firstName
                      ? `${profile.firstName} ${profile.lastName}`
                      : profile?.username || "N/A"}
                  </span>
                </div>
                <div className="info-row">
                  <label>Email Address</label>
                  <span>{profile?.email || ""}</span>
                </div>
                <div className="info-row">
                  <label>Phone Number</label>
                  <span>{profile?.phone || "N/A"}</span>
                </div>
              </div>

              <div className="details-card">
                <h4>Account Security</h4>
                <div className="info-row">
                  <label>Role</label>
                  <span className="role-tag">Staff Access</span>
                </div>
                <div className="info-row">
                  <label>Password</label>
                  <span>â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢</span>
                </div>
                <button className="change-pass-btn">Change Password</button>
              </div>
            </div>

            <button
              className="logout-btn"
              onClick={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                navigate("/login");
              }}
            >
              Logout Account
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StaffProfile;
