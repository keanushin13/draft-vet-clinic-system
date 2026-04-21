import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/AdminProfile.css";
import AdminSidebar from "../../../components/AdminSidebar";
import { useSidebar } from "../../../components/useSidebar";
import { getMe } from "../../../api/api";

// ASSETS
import bellIcon from "../../../assets/Bell_Icon.png";
import userIcon from "../../../assets/Profile.png";

const AdminProfile = () => {
  const navigate = useNavigate();
  const localUser = JSON.parse(localStorage.getItem("user") || "{}");
  const { isOpen, toggle, close } = useSidebar();
  const [profile, setProfile] = useState(localUser);

  useEffect(() => {
    if (!localUser || localUser.role !== "admin") {
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
      <AdminSidebar isOpen={isOpen} onClose={close} />

      {/* MAIN AREA */}
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
              onClick={() => navigate("/admin-notifications")}
            >
              <img src={bellIcon} alt="Notifications" />
            </button>
            <div className="user-profile active-profile">
              <img src={userIcon} alt="Admin Profile" />
            </div>
          </div>
        </header>

        <section className="content-body profile-layout">
          <div className="profile-card">
            <div className="profile-header-bg"></div>
            <div className="profile-content">
              <div className="profile-image-wrapper">
                <img src={userIcon} alt="Admin" className="profile-main-img" />
                <button className="edit-img-btn">ðŸ“·</button>
              </div>

              <h2 className="profile-name">
                {profile?.firstName
                  ? `${profile.firstName} ${profile.lastName}`
                  : profile?.username || "System Administrator"}
              </h2>
              <span className="profile-role-badge">Administrator</span>

              <div className="profile-details-grid">
                <div className="detail-item">
                  <label>Username</label>
                  <p>{profile?.username || "N/A"}</p>
                </div>
                <div className="detail-item">
                  <label>Email Address</label>
                  <p>{profile?.email || "admin@pawcruz.com"}</p>
                </div>
                <div className="detail-item">
                  <label>Account Status</label>
                  <p className="status-active">Active</p>
                </div>
                <div className="detail-item">
                  <label>Role</label>
                  <p>Super Admin</p>
                </div>
              </div>

              <div className="profile-actions">
                <button className="edit-profile-btn">
                  Edit Profile Information
                </button>
                <button className="logout-danger-btn" onClick={handleLogout}>
                  Log Out of Account
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminProfile;
