import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/VetMessages.css";
import VetSidebar from "../../../components/VetSidebar";
import { useSidebar } from "../../../components/useSidebar";
import {
  deleteMessage,
  getMessageThreads,
  getMessageThread,
  sendMessage,
  updateMessage,
} from "../../../api/api";

// ASSETS
import bellIcon from "../../../assets/Bell_Icon.png";
import messageIcon from "../../../assets/Message_Icon.png";
import userIcon from "../../../assets/Profile.png";

const VetMessages = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { isOpen, toggle, close } = useSidebar();

  const [threads, setThreads] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingBody, setEditingBody] = useState("");

  useEffect(() => {
    if (!user || user.role !== "veterinarian") {
      navigate("/login");
      return;
    }
    loadThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadThreads = async () => {
    try {
      const r = await getMessageThreads();
      setThreads(r.data || []);
    } catch {
      setError("Failed to load messages");
    }
  };

  const refreshActiveThread = async (partnerId) => {
    if (!partnerId) return;
    setLoading(true);
    setError("");
    try {
      const r = await getMessageThread(partnerId);
      setMessages(r.data || []);
      await loadThreads();
    } catch {
      setError("Failed to load thread");
    } finally {
      setLoading(false);
    }
  };

  const openThread = (thread) => {
    const partnerId = thread.partner?.id;
    if (!partnerId) return;
    setActiveThread(thread);
    refreshActiveThread(partnerId);
  };

  const handleSend = async () => {
    const partnerId = activeThread?.partner?.id;
    if (!newMsg.trim() || !partnerId) return;
    try {
      await sendMessage({ receiverId: partnerId, body: newMsg.trim() });
      setNewMsg("");
      await refreshActiveThread(partnerId);
    } catch {
      setError("Failed to send message");
    }
  };

  const startEditMessage = (message) => {
    setEditingMessageId(message.id);
    setEditingBody(message.body);
  };

  const saveMessageEdit = async () => {
    if (!editingBody.trim()) return;
    const partnerId = activeThread?.partner?.id;
    try {
      await updateMessage(editingMessageId, { body: editingBody.trim() });
      setEditingMessageId(null);
      setEditingBody("");
      await refreshActiveThread(partnerId);
    } catch {
      setError("Failed to update message");
    }
  };

  const removeMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    const partnerId = activeThread?.partner?.id;
    try {
      await deleteMessage(id);
      await refreshActiveThread(partnerId);
    } catch {
      setError("Failed to delete message");
    }
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
                  key={thread.partner?.id}
                  className={`chat-item ${thread.unread > 0 ? "unread" : ""} ${activeThread?.partner?.id === thread.partner?.id ? "active" : ""}`}
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
                        {thread.lastAt
                          ? new Date(thread.lastAt).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                    <p className="msg-preview">{thread.lastMessage}</p>
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
                  {messages.map((m) => {
                    const isMine = m.senderId === user?.id;
                    const isEditing = editingMessageId === m.id;
                    return (
                      <div
                        key={m.id}
                        className={`msg-bubble ${isMine ? "sent" : "received"}`}
                      >
                        {isEditing ? (
                          <div className="msg-edit-wrap">
                            <input
                              value={editingBody}
                              onChange={(e) => setEditingBody(e.target.value)}
                            />
                            <button
                              className="msg-action"
                              onClick={saveMessageEdit}
                            >
                              Save
                            </button>
                            <button
                              className="msg-action"
                              onClick={() => {
                                setEditingMessageId(null);
                                setEditingBody("");
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <span>{m.body}</span>
                            {isMine && (
                              <div className="msg-actions-row">
                                <button
                                  className="msg-action"
                                  onClick={() => startEditMessage(m)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="msg-action msg-action-danger"
                                  onClick={() => removeMessage(m.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                  {loading && (
                    <p className="chat-feedback">Loading messages...</p>
                  )}
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
                {error && <p className="chat-feedback chat-error">{error}</p>}
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
