import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/StaffMessages.css";
import StaffSidebar from "../../../components/StaffSidebar";
import { useSidebar } from "../../../components/useSidebar";
import {
  getMessageThreads,
  getMessageThread,
  sendMessage,
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

const StaffMessages = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { isOpen, toggle, close } = useSidebar();

  const [activeChat, setActiveChat] = useState(null);
  const [threads, setThreads] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  useEffect(() => {
    if (!user || user.role !== "staff") {
      navigate("/login");
      return;
    }
    getMessageThreads()
      .then((r) => {
        setThreads(r.data);
        if (r.data.length) openThread(r.data[0]);
      })
      .catch(() => {});
  }, [navigate, user]);

  const openThread = (thread) => {
    setActiveChat(thread);
    getMessageThread(thread.partnerId)
      .then((r) => setMessages(r.data))
      .catch(() => {});
  };

  const handleSend = async () => {
    if (!newMsg.trim() || !activeChat) return;
    await sendMessage({ receiverId: activeChat.partnerId, body: newMsg });
    setNewMsg("");
    getMessageThread(activeChat.partnerId)
      .then((r) => setMessages(r.data))
      .catch(() => {});
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
          <h2>Messages</h2>
          <div className="top-bar-right">
            {/* Added the missing navigation handler here */}
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

        <section className="content-body no-scroll">
          <div className="messaging-wrapper">
            {/* CONTACT LIST */}
            <div className="contact-sidebar">
              <div className="search-messages">
                <input type="text" placeholder="Search contacts..." />
              </div>
              <div className="contact-list">
                {threads.map((thread) => (
                  <div
                    key={thread.partnerId}
                    className={`contact-item ${activeChat?.partnerId === thread.partnerId ? "active" : ""} ${thread.unreadCount > 0 ? "unread" : ""}`}
                    onClick={() => openThread(thread)}
                  >
                    <div className="contact-avatar">
                      {(
                        thread.partner?.firstName ||
                        thread.partner?.username ||
                        "?"
                      ).charAt(0)}
                    </div>
                    <div className="contact-info">
                      <div className="contact-name-row">
                        <h4>
                          {thread.partner?.firstName
                            ? `${thread.partner.firstName} ${thread.partner.lastName}`
                            : thread.partner?.username}
                        </h4>
                        <span>
                          {thread.lastMessage
                            ? new Date(
                                thread.lastMessage.createdAt,
                              ).toLocaleDateString()
                            : ""}
                        </span>
                      </div>
                      <p>{thread.lastMessage?.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CHAT WINDOW */}
            <div className="chat-window">
              <div className="chat-header">
                <h3>
                  {activeChat?.partner?.firstName
                    ? `${activeChat.partner.firstName} ${activeChat.partner.lastName}`
                    : activeChat?.partner?.username}
                </h3>
              </div>
              <div className="chat-messages">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`msg-bubble ${m.senderId === user?.id ? "sent" : "received"}`}
                  >
                    {m.body}
                  </div>
                ))}
              </div>
              <div className="chat-input-area">
                <input
                  type="text"
                  placeholder="Type your message here..."
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button className="send-btn" onClick={handleSend}>
                  Send
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StaffMessages;
