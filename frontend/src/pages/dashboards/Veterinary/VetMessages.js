import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/VetMessages.css";
import VetSidebar from "../../../components/VetSidebar";
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
import medicalIcon from "../../../assets/Medical_Icon.png";
import messageIcon from "../../../assets/Message_Icon.png";
import pawLogo from "../../../assets/paw.png";
import inventoryIcon from "../../../assets/payment_icon.png";
import patientsIcon from "../../../assets/Pets_Icon.png";
import userIcon from "../../../assets/Profile.png";

const VetMessages = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { isOpen, toggle, close } = useSidebar();

  const [threads, setThreads] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  useEffect(() => {
    if (!user || user.role !== "veterinarian") {
      navigate("/login");
      return;
    }
    getMessageThreads()
      .then((r) => setThreads(r.data))
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openThread = (thread) => {
    setActiveThread(thread);
    getMessageThread(thread.partnerId)
      .then((r) => setMessages(r.data))
      .catch(() => {});
  };

  const handleSend = async () => {
    if (!newMsg.trim() || !activeThread) return;
    await sendMessage({ receiverId: activeThread.partnerId, body: newMsg });
    setNewMsg("");
    getMessageThread(activeThread.partnerId)
      .then((r) => setMessages(r.data))
      .catch(() => {});
  };

  return (
    <div className="dashboard-container">
      <VetSidebar isOpen={isOpen} onClose={close} />

      {/* MAIN CONTENT */}
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
          <h2>Consultation Messages</h2>
          <div className="top-bar-right">
            <button
              className="notif-btn"
              onClick={() => navigate("/vet-notifications")}
            >
              <img src={bellIcon} alt="Notifications" />
            </button>
            <div
              className="user-profile"
              onClick={() => navigate("/vet-profile")}
            >
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
              {threads.map((thread) => (
                <div
                  key={thread.partnerId}
                  className={`chat-item ${thread.unreadCount > 0 ? "unread" : ""} ${activeThread?.partnerId === thread.partnerId ? "active" : ""}`}
                  onClick={() => openThread(thread)}
                >
                  <div className="chat-info">
                    <div className="chat-top">
                      <span className="sender-name">
                        {thread.partner?.firstName
                          ? `${thread.partner.firstName} ${thread.partner.lastName}`
                          : thread.partner?.username}
                      </span>
                      <span className="chat-time">
                        {thread.lastMessage
                          ? new Date(
                              thread.lastMessage.createdAt,
                            ).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                    <p className="msg-preview">{thread.lastMessage?.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Chat Window Placeholder */}
          <div className="chat-window-pane">
            {activeThread ? (
              <>
                <div className="pane-header">
                  <h3>
                    {activeThread.partner?.firstName
                      ? `${activeThread.partner.firstName} ${activeThread.partner.lastName}`
                      : activeThread.partner?.username}
                  </h3>
                </div>
                <div
                  className="chat-messages"
                  style={{ flex: 1, overflowY: "auto", padding: "16px" }}
                >
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`msg-bubble ${m.senderId === user?.id ? "sent" : "received"}`}
                    >
                      {m.body}
                    </div>
                  ))}
                </div>
                <div
                  className="chat-input-area"
                  style={{ display: "flex", gap: "8px", padding: "16px" }}
                >
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                    }}
                  />
                  <button
                    onClick={handleSend}
                    style={{
                      backgroundColor: "#255065",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <div className="empty-chat-state">
                <img src={messageIcon} alt="Select Chat" />
                <p>Select a conversation to start messaging with pet owners.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default VetMessages;
