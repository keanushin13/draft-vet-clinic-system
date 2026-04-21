import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/AdminMessages.css";
import AdminSidebar from "../../../components/AdminSidebar";
import { useSidebar } from "../../../components/useSidebar";
import {
  getMessageThreads,
  getMessageThread,
  sendMessage,
} from "../../../api/api";

// ASSETS
import bellIcon from "../../../assets/Bell_Icon.png";
import userIcon from "../../../assets/Profile.png";

const AdminMessages = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { isOpen, toggle, close } = useSidebar();

  const [threads, setThreads] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    getMessageThreads()
      .then((r) => setThreads(r.data))
      .catch(() => {});
  }, [navigate, user]);

  const openThread = (thread) => {
    setActiveThread(thread);
    getMessageThread(thread.partner.id)
      .then((r) => setMessages(r.data))
      .catch(() => {});
  };

  const handleSend = async () => {
    if (!newMsg.trim() || !activeThread) return;
    await sendMessage({ receiverId: activeThread.partner.id, body: newMsg });
    setNewMsg("");
    getMessageThread(activeThread.partner.id)
      .then((r) => setMessages(r.data))
      .catch(() => {});
  };

  return (
    <div className="dashboard-container">
      <AdminSidebar isOpen={isOpen} onClose={close} />

      {/* MAIN AREA */}
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
              onClick={() => navigate("/admin-notifications")}
            >
              <img src={bellIcon} alt="Notifications" />
            </button>
            <div
              className="user-profile"
              onClick={() => navigate("/admin-profile")}
            >
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
                <input
                  type="text"
                  placeholder="Search chats..."
                  className="msg-search"
                />
              </div>
              <div className="thread-list">
                {threads.map((thread) => (
                  <div
                    key={thread.partner.id}
                    className={`thread-item ${thread.unread > 0 ? "unread" : ""}`}
                    onClick={() => openThread(thread)}
                  >
                    <div className="thread-avatar">
                      {(
                        thread.partner.firstName ||
                        thread.partner.username ||
                        "?"
                      ).charAt(0)}
                    </div>
                    <div className="thread-info">
                      <div className="thread-top">
                        <span className="thread-name">
                          {thread.partner.firstName
                            ? `${thread.partner.firstName} ${thread.partner.lastName || ""}`.trim()
                            : thread.partner.username}
                        </span>
                        <span className="thread-time">
                          {new Date(thread.lastAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="thread-preview">{thread.lastMessage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CHAT VIEW */}
            <div className="chat-panel">
              {activeThread ? (
                <>
                  <div className="chat-header-bar">
                    <h4>
                      {activeThread.partner.firstName
                        ? `${activeThread.partner.firstName} ${activeThread.partner.lastName || ""}`.trim()
                        : activeThread.partner.username}
                    </h4>
                  </div>
                  <div className="chat-messages-list">
                    {messages.map((m) => (
                      <div
                        key={m.id}
                        className={`msg-bubble ${m.senderId === user.id ? "sent" : "received"}`}
                      >
                        {m.body}
                      </div>
                    ))}
                  </div>
                  <div className="chat-input-area">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={newMsg}
                      onChange={(e) => setNewMsg(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    />
                    <button className="send-btn" onClick={handleSend}>
                      Send
                    </button>
                  </div>
                </>
              ) : (
                <div className="chat-placeholder">
                  <h4>Select a conversation</h4>
                  <p>
                    Click on a thread to view your messages and start chatting.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminMessages;
