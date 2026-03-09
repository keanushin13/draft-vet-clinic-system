import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/PetOwnerMessages.css";

// ASSETS
import appointmentIcon from "../../assets/Appointment_Icon.png";
import bellIcon from "../../assets/Bell_Icon.png";
import dashboardIcon from "../../assets/Dashboard_Icon.png";
import medicalIcon from "../../assets/Medical_Icon.png";
import messageIcon from "../../assets/Message_Icon.png";
import pawLogo from "../../assets/paw.png";
import paymentIcon from "../../assets/payment_icon.png";
import petsIcon from "../../assets/Pets_Icon.png";
import userIcon from "../../assets/User_Icon.png";

const PetOwnerMessages = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [activeChat, setActiveChat] = useState(null);

  // Mock data for chats
  const [chats] = useState([
    { id: 1, name: "Dr. Sarah Dela Cruz", lastMsg: "Hello! Bella's results are ready.", time: "10:30 AM", unread: true },
    { id: 2, name: "Dr. Michael Cruz", lastMsg: "See you on Tuesday for Max's checkup.", time: "Yesterday", unread: false },
  ]);

  useEffect(() => {
    if (!user || user.role !== "pet_owner") {
      navigate("/login");
    }
  }, [navigate, user]);

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={pawLogo} alt="Logo" className="nav-logo" />
          <span>PawCruz</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-item" onClick={() => navigate("/pet-owner")}>
            <img src={dashboardIcon} alt="" className="nav-icon" />
            <span>Dashboard</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/pet-owner-appointments")}>
            <img src={appointmentIcon} alt="" className="nav-icon" />
            <span>Appointment</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/pet-owner-pets")}>
            <img src={petsIcon} alt="" className="nav-icon" />
            <span>My Pets</span>
          </div>
          <div className="nav-item active" onClick={() => navigate("/pet-owner-messages")}>
            <img src={messageIcon} alt="" className="nav-icon" />
            <span>Messages</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/pet-owner-records")}>
            <img src={medicalIcon} alt="" className="nav-icon" />
            <span>Medical Records</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/pet-owner-payments")}>
            <img src={paymentIcon} alt="" className="nav-icon" />
            <span>Payment History</span>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-area">
        <header className="top-bar">
          <h2>Messages</h2>
          <div className="top-bar-right">
            <button className="notif-btn" onClick={() => navigate("/pet-owner-notifications")}>
              <img src={bellIcon} alt="Notifications" className="top-icon" />
            </button>
            <div className="user-profile" onClick={() => navigate("/pet-owner-profile")}>
              <img src={userIcon} alt="User" className="top-avatar" />
            </div>
          </div>
        </header>

        <section className="dashboard-scroll-body chat-layout">
          {/* INBOX LIST */}
          <div className="chat-sidebar">
            <div className="chat-sidebar-header">
              <h3>Conversations</h3>
              <button className="icon-btn-add">+</button>
            </div>
            <div className="chat-list">
              {chats.map(chat => (
                <div 
                  key={chat.id} 
                  className={`chat-item ${activeChat === chat.id ? 'active' : ''}`}
                  onClick={() => setActiveChat(chat.id)}
                >
                  <div className="chat-avatar-placeholder"></div>
                  <div className="chat-info">
                    <div className="chat-top-row">
                      <span className="chat-name">{chat.name}</span>
                      <span className="chat-time">{chat.time}</span>
                    </div>
                    <p className="chat-preview">{chat.lastMsg}</p>
                  </div>
                  {chat.unread && <div className="unread-dot"></div>}
                </div>
              ))}
            </div>
          </div>

          {/* CHAT WINDOW */}
          <div className="chat-window">
            {activeChat ? (
              <>
                <div className="chat-window-header">
                  <div className="chat-avatar-placeholder"></div>
                  <div className="header-text">
                    <h4>{chats.find(c => c.id === activeChat)?.name}</h4>
                    <span>Online</span>
                  </div>
                </div>
                <div className="chat-messages-area">
                  <div className="msg-received">
                    <p>Hello! Bella's laboratory results are ready for pickup, or I can send them here.</p>
                    <span>10:30 AM</span>
                  </div>
                  <div className="msg-sent">
                    <p>That's great! Please send them here if possible. Thank you, Doc!</p>
                    <span>10:32 AM</span>
                  </div>
                </div>
                <div className="chat-input-area">
                  <input type="text" placeholder="Type your message..." />
                  <button className="send-btn">Send</button>
                </div>
              </>
            ) : (
              <div className="chat-empty-state">
                <img src={messageIcon} className="large-faded-icon" alt="" />
                <p>Select a conversation to start messaging</p>
                <button className="new-msg-btn-rect">+ Start New Chat</button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default PetOwnerMessages;