import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/VetMessages.css";

// ASSETS
import appointmentIcon from "../../../assets/Appointment_Icon.png";
import bellIcon from "../../../assets/Bell_Icon.png";
import dashboardIcon from "../../../assets/Dashboard_Icon.png";
import medicalIcon from "../../../assets/Medical_Icon.png";
import messageIcon from "../../../assets/Message_Icon.png";
import pawLogo from "../../../assets/paw.png";
import inventoryIcon from "../../../assets/payment_icon.png";
import patientsIcon from "../../../assets/Pets_Icon.png";
import userIcon from "../../../assets/User_Icon.png";

const VetMessages = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // Dummy data for chat list
  const [chats] = useState([
    { id: 1, sender: "Juan Dela Cruz", pet: "Max", lastMsg: "When is the next vaccine?", time: "10:30 AM", unread: true },
    { id: 2, sender: "Maria Santos", pet: "Luna", lastMsg: "The ear infection looks better.", time: "Yesterday", unread: false },
    { id: 3, sender: "Ricardo Ramos", pet: "Cooper", lastMsg: "Thank you, Doctor!", time: "Feb 2", unread: false },
  ]);

  useEffect(() => {
    if (!user || user.role !== "veterinarian") {
      navigate("/login");
    }
  }, [navigate, user]);

  return (
    <div className="dashboard-container">
      {/* SIDEBAR - Messages is Active */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={pawLogo} alt="Logo" />
          <span>PawCruz</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-item" onClick={() => navigate("/vet")}>
            <img src={dashboardIcon} alt="" />
            <span>Dashboard</span>
          </div>
          
          <div className="nav-item" onClick={() => navigate("/vet-patients")}>
            <img src={patientsIcon} alt="" />
            <span>Patients</span>
          </div>

          <div className="nav-item" onClick={() => navigate("/vet-calendar")}>
            <img src={appointmentIcon} alt="" />
            <span>Calendar</span>
          </div>

          <div className="nav-item active" onClick={() => navigate("/vet-messages")}>
            <img src={messageIcon} alt="" />
            <span>Messages</span>
          </div>

          <div className="nav-item" onClick={() => navigate("/vet-medical-records")}>
            <img src={medicalIcon} alt="" />
            <span>Medical Records</span>
          </div>

          <div className="nav-item" onClick={() => navigate("/vet-inventory")}>
            <img src={inventoryIcon} alt="" />
            <span>Inventory</span>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-area">
        <header className="top-bar">
          <h2>Consultation Messages</h2>
          <div className="top-bar-right">
            <button className="notif-btn" onClick={() => navigate("/vet-notifications")}>
              <img src={bellIcon} alt="Notifications" />
            </button>
            <div className="user-profile" onClick={() => navigate("/vet-profile")}>
              <img src={userIcon} alt="User" />
            </div>
          </div>
        </header>

        <section className="content-body message-layout">
          {/* LEFT: Chat List */}
          <div className="chat-list-pane">
            <div className="pane-header">
              <h3>Inbox</h3>
            </div>
            <div className="chat-items">
              {chats.map(chat => (
                <div key={chat.id} className={`chat-item ${chat.unread ? 'unread' : ''}`}>
                  <div className="chat-info">
                    <div className="chat-top">
                      <span className="sender-name">{chat.sender}</span>
                      <span className="chat-time">{chat.time}</span>
                    </div>
                    <span className="pet-tag">Pet: {chat.pet}</span>
                    <p className="msg-preview">{chat.lastMsg}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Chat Window Placeholder */}
          <div className="chat-window-pane">
            <div className="empty-chat-state">
              <img src={messageIcon} alt="Select Chat" />
              <p>Select a conversation to start messaging with pet owners.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default VetMessages;