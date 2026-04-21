import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/AdminUserManagement.css";
import AdminSidebar from "../../../components/AdminSidebar";
import { useSidebar } from "../../../components/useSidebar";
import { getUsers, deleteUser } from "../../../api/api";

// ASSETS
import bellIcon from "../../../assets/Bell_Icon.png";
import userIcon from "../../../assets/Profile.png";

const AdminUserManagement = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { isOpen, toggle, close } = useSidebar();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

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
  }, [navigate, user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this user?")) return;
    await deleteUser(id);
    loadUsers();
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
              <button className="add-user-btn">+ Add New User</button>
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
                          <button className="edit-btn">Edit</button>
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
    </div>
  );
};

export default AdminUserManagement;
