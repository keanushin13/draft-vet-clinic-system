import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/PetOwnerMessages.css";
import PetOwnerSidebar from "../../../components/PetOwnerSidebar";
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
import paymentIcon from "../../../assets/payment_icon.png";
import petsIcon from "../../../assets/Pets_Icon.png";
import userIcon from "../../../assets/Profile.png";

const PetOwnerMessages = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { isOpen, toggle, close } = useSidebar();

  const [threads, setThreads] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  useEffect(() => {
    if (!user || user.role !== "pet_owner") {
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
      <PetOwnerSidebar isOpen={isOpen} onClose={close} />

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
          <h2>Messages</h2>
          <div className="top-bar-right">
            <button
              className="notif-btn"
              onClick={() => navigate("/pet-owner-notifications")}
            >
              <img src={bellIcon} alt="Notifications" />
            </button>
            <div
              className="user-profile"
              onClick={() => navigate("/pet-owner-profile")}
            >
              <img src={userIcon} alt="User" />
            </div>
          </div>
        </header>

        <section className="content-body">
          <div
            className="message-header-action"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h3 style={{ fontFamily: "Poppins", fontWeight: "600" }}>
              Conversations
            </h3>
            <button
              className="new-msg-btn"
              style={{
                backgroundColor: "#438fb5",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              + Start New Chat
            </button>
          </div>

          {threads.length === 0 ? (
            <div
              className="dashboard-welcome-card"
              style={{
                background: "white",
                padding: "30px",
                borderRadius: "15px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              <p style={{ color: "#555" }}>
                No active conversations. Reach out to your vet to start a chat!
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "16px", height: "500px" }}>
              <div
                style={{
                  width: "260px",
                  background: "white",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  overflowY: "auto",
                }}
              >
                {threads.map((t) => (
                  <div
                    key={t.partnerId}
                    onClick={() => openThread(t)}
                    style={{
                      padding: "12px 16px",
                      cursor: "pointer",
                      borderBottom: "1px solid #f0f0f0",
                      background:
                        activeThread?.partnerId === t.partnerId
                          ? "#f0f9ff"
                          : "white",
                    }}
                  >
                    <strong style={{ fontSize: "0.9rem", color: "#255065" }}>
                      {t.partner?.firstName
                        ? `${t.partner.firstName} ${t.partner.lastName}`
                        : t.partner?.username}
                    </strong>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "#888",
                        margin: "2px 0 0",
                      }}
                    >
                      {t.lastMessage?.body}
                    </p>
                  </div>
                ))}
              </div>
              <div
                style={{
                  flex: 1,
                  background: "white",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {activeThread ? (
                  <>
                    <div
                      style={{
                        padding: "16px",
                        borderBottom: "1px solid #f0f0f0",
                        fontWeight: "600",
                        color: "#255065",
                      }}
                    >
                      {activeThread.partner?.firstName
                        ? `${activeThread.partner.firstName} ${activeThread.partner.lastName}`
                        : activeThread.partner?.username}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "16px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      {messages.map((m) => (
                        <div
                          key={m.id}
                          style={{
                            alignSelf:
                              m.senderId === user?.id
                                ? "flex-end"
                                : "flex-start",
                            background:
                              m.senderId === user?.id ? "#255065" : "#f0f9ff",
                            color: m.senderId === user?.id ? "white" : "#333",
                            padding: "8px 14px",
                            borderRadius: "12px",
                            maxWidth: "70%",
                            fontSize: "0.9rem",
                          }}
                        >
                          {m.body}
                        </div>
                      ))}
                    </div>
                    <div
                      style={{
                        padding: "12px",
                        display: "flex",
                        gap: "8px",
                        borderTop: "1px solid #f0f0f0",
                      }}
                    >
                      <input
                        type="text"
                        value={newMsg}
                        onChange={(e) => setNewMsg(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Type a message..."
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
                          background: "#255065",
                          color: "white",
                          border: "none",
                          padding: "10px 16px",
                          borderRadius: "8px",
                          cursor: "pointer",
                        }}
                      >
                        Send
                      </button>
                    </div>
                  </>
                ) : (
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#888",
                    }}
                  >
                    Select a conversation
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default PetOwnerMessages;
