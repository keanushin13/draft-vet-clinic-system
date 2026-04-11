import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/AdminMessages.css";

// ASSETS
import bellIcon from "../../../assets/Bell_Icon.png";
import dashboardIcon from "../../../assets/Dashboard_Icon.png";
import messageIcon from "../../../assets/Message_Icon.png";
import pawLogo from "../../../assets/paw.png";
import userIcon from "../../../assets/Profile.png";
import userManagementIcon from "../../../assets/UserManagement_Icon.png";

const AdminMessages = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Sample data for message threads
  const [threads] = useState([
    { id: 1, name: "Dr. Elena Rodriguez", role: "Veterinarian", lastMsg: "The inventory report is ready.", time: "10:45 AM", unread: true },
    { id: 2, name: "Mark Santos", role: "Staff", lastMsg: "Patient #1024 has been updated.", time: "Yesterday", unread: false },
    { id: 3, name: "System Alerts", role: "Automated", lastMsg: "Database backup successful.", time: "Jan 22", unread: false },
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

          <div className="nav-item active" onClick={() => navigate("/admin-messages")}>
            <img src={messageIcon} alt="Messages" />
            <span>Messages</span>
          </div>
        </nav>
      </aside>

      {/* MAIN AREA */}
      <main className="main-area">
        <header className="top-bar">
          <h2>Messages</h2>
          <div className="top-bar-right">
            <button className="notif-btn" onClick={() => navigate("/admin-notifications")}>
              <img src={bellIcon} alt="Notifications" />
            </button>
            <div className="user-profile" onClick={() => navigate("/admin-profile")}>
              <img src={userIcon} alt="Admin Profile" />
            </div>
          </div>
        </header>

        <section className="content-body message-layout">
          <div className="message-container">
            {/* INBOX LIST */}
            <div className="inbox-panel">
              <div className="inbox-header">
                <h3>Inbox</h3>
                <input type="text" placeholder="Search chats..." className="msg-search" />
              </div>
              <div className="thread-list">
                {threads.map((thread) => (
                  <div key={thread.id} className={`thread-item ${thread.unread ? 'unread' : ''}`}>
                    <div className="thread-avatar">{thread.name.charAt(0)}</div>
                    <div className="thread-info">
                      <div className="thread-top">
                        <span className="thread-name">{thread.name}</span>
                        <span className="thread-time">{thread.time}</span>
                      </div>
                      <p className="thread-preview">{thread.lastMsg}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CHAT VIEW */}
            <div className="chat-panel">
              <div className="chat-placeholder">
                <img src={messageIcon} alt="" />
                <h4>Select a conversation</h4>
                <p>Click on a thread to view your messages and start chatting.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminMessages;