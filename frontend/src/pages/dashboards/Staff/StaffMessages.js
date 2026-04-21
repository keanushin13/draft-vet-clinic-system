import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/StaffMessages.css";
import StaffSidebar from "../../../components/StaffSidebar";
import { useSidebar } from "../../../components/useSidebar";

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

const StaffMessages = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { isOpen, toggle, close } = useSidebar();

  const [activeChat, setActiveChat] = useState(1);
  const [contacts] = useState([
    { id: 1, name: "Juan Dela Cruz", lastMsg: "Is the vaccine available?", time: "10:30 AM", unread: true },
    { id: 2, name: "Maria Clara", lastMsg: "Thank you for the update.", time: "Yesterday", unread: false },
    { id: 3, name: "Pedro Penduko", lastMsg: "Can I move my appointment?", time: "Jan 22", unread: false },
  ]);

  useEffect(() => {
    if (!user || user.role !== "staff") {
      navigate("/login");
    }
  }, [navigate, user]);

  return (
    <div className="dashboard-container">
            <StaffSidebar isOpen={isOpen} onClose={close} />

      <main className="main-area">
        <header className="top-bar">
          <button className="hamburger-btn" onClick={toggle} aria-label="Toggle menu"><span /><span /><span /></button>
          <h2>Messages</h2>
          <div className="top-bar-right">
            {/* Added the missing navigation handler here */}
            <button className="notif-btn" onClick={() => navigate("/staff-notifications")}>
              <img src={bellIcon} alt="Notif" />
            </button>
            <div className="user-profile" onClick={() => navigate("/staff-profile")}>
              <img src={userIcon} alt="Profile" />
            </div>
          </div>
        </header>

        <section className="content-body no-scroll">
          <div className="messaging-wrapper">
            {/* CONTACT LIST */}
            <div className="contact-sidebar">
              <div className="search-messages">
                <input type="text" placeholder="Search contacts..." />
              </div>
              <div className="contact-list">
                {contacts.map((contact) => (
                  <div 
                    key={contact.id} 
                    className={`contact-item ${activeChat === contact.id ? "active" : ""} ${contact.unread ? "unread" : ""}`}
                    onClick={() => setActiveChat(contact.id)}
                  >
                    <div className="contact-avatar">{contact.name.charAt(0)}</div>
                    <div className="contact-info">
                      <div className="contact-name-row">
                        <h4>{contact.name}</h4>
                        <span>{contact.time}</span>
                      </div>
                      <p>{contact.lastMsg}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CHAT WINDOW */}
            <div className="chat-window">
              <div className="chat-header">
                <h3>{contacts.find(c => c.id === activeChat)?.name}</h3>
                <small>Online</small>
              </div>
              <div className="chat-messages">
                <div className="msg-bubble received">Hello! I would like to ask if the Rabies Vaccine is available today?</div>
                <div className="msg-bubble sent">Hi! Yes, we have stock available. Would you like to book an appointment?</div>
              </div>
              <div className="chat-input-area">
                <input type="text" placeholder="Type your message here..." />
                <button className="send-btn">Send</button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StaffMessages;