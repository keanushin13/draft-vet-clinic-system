import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/AdminUserManagement.css";
import AdminSidebar from "../../../components/AdminSidebar";
import { useSidebar } from "../../../components/useSidebar";
import { getUsers, createUser, updateUser, deleteUser } from "../../../api/api";

// ASSETS
import bellIcon from "../../../assets/Bell_Icon.png";
import userIcon from "../../../assets/Profile.png";

const AdminUserManagement = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { isOpen, toggle, close } = useSidebar();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const EMPTY_FORM = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    role: "pet_owner",
    password: "",
  };
  const [modalMode, setModalMode] = useState(null); // "add" | "edit"
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadUsers = () =>
    getUsers()
      .then((r) => setUsers(r.data))
      .catch(() => {});

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this user?")) return;
    await deleteUser(id);
    loadUsers();
  };

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setFormError("");
    setEditTarget(null);
    setModalMode("add");
  };

  const openEdit = (u) => {
    setForm({
      firstName: u.firstName || "",
      lastName: u.lastName || "",
      username: u.username || "",
      email: u.email || "",
      role: u.role || "pet_owner",
      password: "",
    });
    setFormError("");
    setEditTarget(u);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditTarget(null);
  };

  const handleFormChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      if (modalMode === "add") {
        await createUser(form);
      } else {
        const payload = { ...form };
        if (!payload.password) delete payload.password;
        await updateUser(editTarget.id, payload);
      }
      closeModal();
      loadUsers();
    } catch (err) {
      setFormError(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const filtered = users.filter((u) =>
    (u.firstName + " " + u.lastName + " " + u.username + " " + u.email)
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

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
          <h2>User Management</h2>
          <div className="top-bar-right">
            <button
              className="notif-btn"
              onClick={() => navigate("/admin-notifications")}
            >
              <img src={bellIcon} alt="Notifications" />
            </button>
            <div
              className="user-profile"
              onClick={() => navigate("/admin-profile")}
            >
              <img src={userIcon} alt="Admin Profile" />
            </div>
          </div>
        </header>

        <section className="content-body">
          <div className="user-management-card">
            <div className="table-header-actions">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button className="add-user-btn" onClick={openAdd}>
                + Add New User
              </button>
            </div>

            <div className="user-table-wrapper">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.id}>
                      <td className="user-name-cell">
                        <div className="user-avatar-small">
                          {(u.firstName || u.username || "?").charAt(0)}
                        </div>
                        <span>
                          {u.firstName
                            ? `${u.firstName} ${u.lastName || ""}`.trim()
                            : u.username}
                        </span>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`role-badge ${u.role}`}>{u.role}</span>
                      </td>
                      <td>
                        <span
                          className={`status-pill ${u.isVerified ? "active" : "inactive"}`}
                        >
                          {u.isVerified ? "Active" : "Unverified"}
                        </span>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button
                            className="edit-btn"
                            onClick={() => openEdit(u)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(u.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
      {/* ADD / EDIT MODAL */}
      {modalMode && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>{modalMode === "add" ? "Add New User" : "Edit User"}</h3>

            <form onSubmit={handleSubmit} className="user-modal-form">
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
                <label>Username *</label>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleFormChange}
                  placeholder="Username"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleFormChange}
                  placeholder="Email"
                  required
                />
              </div>

              <div className="form-group">
                <label>Role *</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleFormChange}
                  required
                >
                  <option value="pet_owner">Pet Owner</option>
                  <option value="staff">Staff</option>
                  <option value="veterinarian">Veterinarian</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  Password{" "}
                  {modalMode === "edit" ? "(leave blank to keep current)" : "*"}
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleFormChange}
                  placeholder={
                    modalMode === "edit"
                      ? "New password (optional)"
                      : "Password"
                  }
                  required={modalMode === "add"}
                />
              </div>

              {formError && <p className="modal-error">{formError}</p>}

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn" disabled={saving}>
                  {saving
                    ? "Saving..."
                    : modalMode === "add"
                      ? "Create User"
                      : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
