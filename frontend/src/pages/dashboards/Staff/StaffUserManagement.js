import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/StaffUserManagement.css";
import StaffSidebar from "../../../components/StaffSidebar";
import { useSidebar } from "../../../components/useSidebar";
import {
  getStaffClients,
  createStaffClient,
  updateStaffClient,
  toggleStaffClientActive,
} from "../../../api/api";

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

const StaffUserManagement = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { isOpen, toggle, close } = useSidebar();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [modalMode, setModalMode] = useState(null); // view | add | edit
  const [selectedUser, setSelectedUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const loadUsers = () =>
    getStaffClients()
      .then((r) => setUsers(r.data))
      .catch(() => setUsers([]));

  useEffect(() => {
    if (!user || user.role !== "staff") {
      navigate("/login");
      return;
    }
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q) ||
      (u.username || "").toLowerCase().includes(q)
    );
  });

  const openAdd = () => {
    setError("");
    setSelectedUser(null);
    setForm({
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      phone: "",
      password: "",
    });
    setModalMode("add");
  };

  const openEdit = (u) => {
    setError("");
    setSelectedUser(u);
    setForm({
      firstName: u.firstName || "",
      lastName: u.lastName || "",
      username: u.username || "",
      email: u.email || "",
      phone: u.phone || "",
      password: "",
    });
    setModalMode("edit");
  };

  const openView = (u) => {
    setSelectedUser(u);
    setModalMode("view");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedUser(null);
    setError("");
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (modalMode === "add") {
        await createStaffClient({ ...form, role: "pet_owner" });
      } else if (modalMode === "edit" && selectedUser) {
        const payload = { ...form, role: "pet_owner" };
        if (!payload.password) delete payload.password;
        await updateStaffClient(selectedUser.id, payload);
      }
      closeModal();
      await loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save client");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (u) => {
    try {
      await toggleStaffClientActive(u.id);
      await loadUsers();
    } catch {
      setError("Failed to update client status");
    }
  };

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
          <h2>User Management</h2>
          <div className="top-bar-right">
            <button
              className="notif-btn"
              onClick={() => navigate("/staff-notifications")}
            >
              <img src={bellIcon} alt="Notif" />
            </button>
            <div
              className="user-profile"
              onClick={() => navigate("/staff-profile")}
            >
              <img src={userIcon} alt="Profile" />
            </div>
          </div>
        </header>

        <section className="content-body">
          <div className="user-mgmt-header">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by name or email..."
                className="user-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="add-user-btn" onClick={openAdd}>
              + Add New Client
            </button>
          </div>

          <div className="user-table-card">
            <table className="user-table">
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Contact Info</th>
                  <th>Registered Pets</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="user-info-cell">
                        <div className="user-mini-avatar">
                          {(u.firstName || u.username).charAt(0)}
                        </div>
                        <strong>
                          {u.firstName
                            ? `${u.firstName} ${u.lastName}`
                            : u.username}
                        </strong>
                      </div>
                    </td>
                    <td>
                      <div className="contact-info-cell">
                        <span>{u.email}</span>
                        <small>{u.phone || "—"}</small>
                      </div>
                    </td>
                    <td>{u._count?.pets ?? 0} Pet(s)</td>
                    <td>
                      <span
                        className={`user-status ${u.isActive ? "active" : "suspended"}`}
                      >
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button
                          className="btn-view"
                          onClick={() => openView(u)}
                        >
                          View
                        </button>
                        <button
                          className="btn-edit"
                          onClick={() => openEdit(u)}
                        >
                          Edit
                        </button>
                        <button
                          className={u.isActive ? "btn-remove" : "btn-edit"}
                          onClick={() => toggleStatus(u)}
                        >
                          {u.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {modalMode && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            {modalMode === "view" && selectedUser ? (
              <>
                <h3>Client Details</h3>
                <p>
                  <strong>Name:</strong> {selectedUser.firstName || ""}{" "}
                  {selectedUser.lastName || ""}
                </p>
                <p>
                  <strong>Username:</strong> {selectedUser.username}
                </p>
                <p>
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedUser.phone || "-"}
                </p>
                <p>
                  <strong>Pets:</strong> {selectedUser._count?.pets ?? 0}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {selectedUser.isActive ? "Active" : "Inactive"}
                </p>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={submitForm} className="user-modal-form">
                <h3>
                  {modalMode === "add" ? "Add New Client" : "Edit Client"}
                </h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      name="firstName"
                      value={form.firstName}
                      onChange={onChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      name="lastName"
                      value={form.lastName}
                      onChange={onChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Username</label>
                  <input
                    name="username"
                    value={form.username}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input name="phone" value={form.phone} onChange={onChange} />
                </div>
                <div className="form-group">
                  <label>
                    Password
                    {modalMode === "edit" ? " (optional)" : ""}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={onChange}
                    required={modalMode === "add"}
                  />
                </div>
                {error && <p className="modal-error">{error}</p>}
                <div className="modal-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="save-btn" disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffUserManagement;
