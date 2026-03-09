import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/AdminUserManagement.css";

// ASSETS
import bellIcon from "../../assets/Bell_Icon.png";
import dashboardIcon from "../../assets/Dashboard_Icon.png";
import messageIcon from "../../assets/Message_Icon.png";
import pawLogo from "../../assets/paw.png";
import userIcon from "../../assets/User_Icon.png";
import userManagementIcon from "../../assets/UserManagement_Icon.png";

const AdminUserManagement = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Sample data for user management
  const [users] = useState([
    { id: 1, name: "Dr. Elena Rodriguez", email: "elena@pawcruz.com", role: "Veterinarian", status: "Active" },
    { id: 2, name: "Mark Santos", email: "mark@pawcruz.com", role: "Staff", status: "Active" },
    { id: 3, name: "Juan Dela Cruz", email: "juan@example.com", role: "Pet Owner", status: "Active" },
    { id: 4, name: "Bianca Gonzales", email: "bianca@pawcruz.com", role: "Staff", status: "Inactive" },
  ]);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
    }
  }, [navigate, user]);

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={pawLogo} alt="Logo" />
          <span>PawCruz</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-item" onClick={() => navigate("/admin")}>
            <img src={dashboardIcon} alt="Dashboard" />
            <span>Dashboard</span>
          </div>
          
          <div className="nav-item active" onClick={() => navigate("/admin-users")}>
            <img src={userManagementIcon} alt="Management" />
            <span>User Management</span>
          </div>

          <div className="nav-item" onClick={() => navigate("/admin-messages")}>
            <img src={messageIcon} alt="Messages" />
            <span>Messages</span>
          </div>
        </nav>
      </aside>

      {/* MAIN AREA */}
      <main className="main-area">
        <header className="top-bar">
          <h2>User Management</h2>
          <div className="top-bar-right">
            <button className="notif-btn" onClick={() => navigate("/admin-notifications")}>
              <img src={bellIcon} alt="Notifications" />
            </button>
            <div className="user-profile" onClick={() => navigate("/admin-profile")}>
              <img src={userIcon} alt="Admin Profile" />
            </div>
          </div>
        </header>

        <section className="content-body">
          <div className="user-management-card">
            <div className="table-header-actions">
              <div className="search-box">
                <input type="text" placeholder="Search users by name or email..." />
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
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="user-name-cell">
                        <div className="user-avatar-small">{u.name.charAt(0)}</div>
                        <span>{u.name}</span>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`role-badge ${u.role.toLowerCase().replace(" ", "-")}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <span className={`status-pill ${u.status.toLowerCase()}`}>
                          {u.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button className="edit-btn">Edit</button>
                          <button className="delete-btn">Remove</button>
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