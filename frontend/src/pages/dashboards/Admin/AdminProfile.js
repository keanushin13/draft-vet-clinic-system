import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopbarUserMenu from "../../../components/TopbarUserMenu";
import "../../../css/AdminProfile.css";
import AdminSidebar from "../../../components/AdminSidebar";
import { useSidebar } from "../../../components/useSidebar";
import { getMe, updateMe } from "../../../api/api";

// ASSETS
import bellIcon from "../../../assets/Bell_Icon.png";
import userIcon from "../../../assets/Profile.png";

const AdminProfile = () => {
  const navigate = useNavigate();
  const localUser = JSON.parse(localStorage.getItem("user") || "{}");
  const { isOpen, toggle, close } = useSidebar();
  const [profile, setProfile] = useState(localUser);
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!localUser || localUser.role !== "admin") {
      navigate("/login");
      return;
    }
    getMe()
      .then((r) => setProfile(r.data))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openEdit = () => {
    setForm({
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      username: profile?.username || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      address: profile?.address || "",
    });
    setFormError("");
    setShowEdit(true);
  };

  const handleFormChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      const res = await updateMe(form);
      setProfile(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      setShowEdit(false);
    } catch (err) {
      setFormError(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

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
            <TopbarUserMenu avatarSrc={userIcon} avatarAlt="Admin Profile" profilePath="/admin-profile" />
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
                <button className="edit-profile-btn" onClick={openEdit}>
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
      {/* EDIT PROFILE MODAL */}
      {showEdit && (
        <div className="modal-overlay" onClick={() => setShowEdit(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Profile</h3>
            <form onSubmit={handleSave} className="user-modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleFormChange}
                    placeholder="First name"
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleFormChange}
                    placeholder="Last name"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Username</label>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleFormChange}
                  placeholder="Username"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleFormChange}
                  placeholder="Email"
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleFormChange}
                  placeholder="Phone number"
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleFormChange}
                  placeholder="Address"
                />
              </div>
              {formError && <p className="modal-error">{formError}</p>}
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowEdit(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
