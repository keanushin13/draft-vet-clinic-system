import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/AdminNotif.css";

// ASSETS
import bellIcon from "../../assets/Bell_Icon.png";
import dashboardIcon from "../../assets/Dashboard_Icon.png";
import messageIcon from "../../assets/Message_Icon.png";
import pawLogo from "../../assets/paw.png";
import userIcon from "../../assets/User_Icon.png";
import userManagementIcon from "../../assets/UserManagement_Icon.png";

const AdminNotif = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Sample Admin Notifications
  const [notifications] = useState([
    { id: 1, type: "system", title: "System Update", message: "Server maintenance scheduled for 12:00 AM.", time: "2 hours ago", status: "unread" },
    { id: 2, type: "user", title: "New Staff Registered", message: "A new staff account has been created for Dr. Elena.", time: "5 hours ago", status: "unread" },
    { id: 3, type: "security", title: "Failed Login Attempt", message: "Multiple failed logins detected from IP 192.168.1.1.", time: "Yesterday", status: "read" },
    { id: 4, type: "inventory", title: "Low Stock Alert", message: "Rabies Vaccine is running low (5 vials remaining).", time: "Jan 22", status: "read" },
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

      {/* MAIN AREA */}
      <main className="main-area">
        <header className="top-bar">
          <h2>Notifications</h2>
          <div className="top-bar-right">
            <button className="notif-btn active-notif">
              <img src={bellIcon} alt="Notifications" />
            </button>
            <div className="user-profile" onClick={() => navigate("/admin-profile")}>
              <img src={userIcon} alt="Admin Profile" />
            </div>
          </div>
        </header>

        <section className="content-body notif-layout">
          <div className="notif-card-container">
            <div className="notif-header-flex">
              <h3>Recent Notifications</h3>
              <button className="mark-read-btn">Mark all as read</button>
            </div>

            <div className="notif-list">
              {notifications.map((notif) => (
                <div key={notif.id} className={`notif-item ${notif.status}`}>
                  <div className={`notif-icon-circle ${notif.type}`}>
                    <img src={bellIcon} alt="" />
                  </div>
                  <div className="notif-content">
                    <div className="notif-text-top">
                      <span className="notif-title">{notif.title}</span>
                      <span className="notif-time">{notif.time}</span>
                    </div>
                    <p className="notif-message">{notif.message}</p>
                  </div>
                  {notif.status === "unread" && <div className="unread-dot"></div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminNotif;