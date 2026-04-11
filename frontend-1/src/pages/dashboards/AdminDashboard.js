import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/AdminDashboard.css";

// ASSETS
import bellIcon from "../../assets/Bell_Icon.png";
import dashboardIcon from "../../assets/Dashboard_Icon.png";
import messageIcon from "../../assets/Message_Icon.png";
import pawLogo from "../../assets/paw.png";
import userIcon from "../../assets/Profile.png";
import userManagementIcon from "../../assets/UserManagement_Icon.png";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

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
          <div className="nav-item active" onClick={() => navigate("/admin")}>
            <img src={dashboardIcon} alt="Dashboard" />
            <span>Dashboard</span>
          </div>
          
          <div className="nav-item" onClick={() => navigate("/admin-users")}>
            <img src={userManagementIcon} alt="Management" />
            <span>User Management</span>
          </div>

          <div className="nav-item" onClick={() => navigate("/admin-messages")}>
            <img src={messageIcon} alt="Messages" />
            <span>Messages</span>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-area">
        <header className="top-bar">
          <h2>Welcome, Admin</h2>
          <div className="top-bar-right">
            <button className="notif-btn" onClick={() => navigate("/admin-notifications")}>
              <img src={bellIcon} alt="Notifications" />
            </button>
            <div className="user-profile" onClick={() => navigate("/admin-profile")}>
              <img src={userIcon} alt="Admin Profile" />
            </div>
          </div>
        </header>

        <section className="dashboard-body">
          <div className="welcome-section">
            <h3>System Overview</h3>
            <p>Monitoring clinic performance and user activity.</p>
          </div>

          {/* ORGANIZED STATS GRID */}
          <div className="admin-stats-grid">
            <div className="stat-card blue">
              <div className="stat-info">
                <span>Total Users</span>
                <h4>1,284</h4>
              </div>
            </div>
            <div className="stat-card green">
              <div className="stat-info">
                <span>Monthly Revenue</span>
                <h4>â‚±45,200</h4>
              </div>
            </div>
            <div className="stat-card yellow">
              <div className="stat-info">
                <span>Active Appointments</span>
                <h4>32</h4>
              </div>
            </div>
            <div className="stat-card red">
              <div className="stat-info">
                <span>Low Stock Items</span>
                <h4>5</h4>
              </div>
            </div>
          </div>

          {/* LOWER SECTION FLEX */}
          <div className="admin-recent-flex">
             <div className="recent-box">
                <h4>System Health</h4>
                <div className="health-status">
                   <p style={{color: '#63c58d', fontWeight: 'bold'}}>â— All systems operational</p>
                   <small>Last backup: 2 hours ago</small>
                </div>
             </div>
             
             <div className="recent-box">
                <h4>Quick Actions</h4>
                <div className="action-buttons">
                    <button className="admin-btn">Generate Report</button>
                    <button className="admin-btn secondary">Database Backup</button>
                </div>
             </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;