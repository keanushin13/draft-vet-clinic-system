import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopbarUserMenu from "../../../components/TopbarUserMenu";
import "../../../css/PetOwnerMessages.css";
import PetOwnerSidebar from "../../../components/PetOwnerSidebar";
import { useSidebar } from "../../../components/useSidebar";
import {
  deleteMessage,
  getAvailableVets,
  getMessageThread,
  getMessageThreads,
  sendMessage,
  updateMessage,
} from "../../../api/api";

import bellIcon from "../../../assets/Bell_Icon.png";
import userIcon from "../../../assets/Profile.png";

const PetOwnerMessages = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { isOpen, toggle, close } = useSidebar();

  const [threads, setThreads] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedContactId, setSelectedContactId] = useState("");
  const [activeThread, setActiveThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingBody, setEditingBody] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "pet_owner") {
      navigate("/login");
      return;
    }
    loadThreads();
    loadContacts();
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

  const loadContacts = async () => {
    try {
      const r = await getAvailableVets();
      const vets = r.data || [];
      setContacts(vets);
      if (!selectedContactId && vets.length) {
        setSelectedContactId(vets[0].id);
      }
    } catch {
      setError("Failed to load contacts");
    }
  };

  const refreshActiveThread = async (partnerId) => {
    if (!partnerId) return;
    try {
      const r = await getMessageThread(partnerId);
      setMessages(r.data || []);
      await loadThreads();
    } catch {
      setError("Failed to load thread");
    }
  };

  const openThread = (thread) => {
    const partnerId = thread.partner?.id;
    if (!partnerId) return;
    setActiveThread(thread);
    setSelectedContactId(partnerId);
    refreshActiveThread(partnerId);
  };

  const startThreadWithSelectedContact = async () => {
    const partner = contacts.find((c) => c.id === selectedContactId);
    if (!partner) return;

    const tempThread = {
      partner,
      unread: 0,
      lastAt: null,
      lastMessage: "",
    };

    setActiveThread(tempThread);
    setMessages([]);
    await refreshActiveThread(partner.id);
  };

  const handleSend = async () => {
    const partnerId = activeThread?.partner?.id;
    if (!partnerId || !newMsg.trim()) return;

    try {
      await sendMessage({ receiverId: partnerId, body: newMsg.trim() });
      setNewMsg("");
      await refreshActiveThread(partnerId);
    } catch {
      setError("Failed to send message");
    }
  };

  const saveEdit = async () => {
    const partnerId = activeThread?.partner?.id;
    if (!editingMessageId || !editingBody.trim() || !partnerId) return;

    try {
      await updateMessage(editingMessageId, { body: editingBody.trim() });
      setEditingMessageId(null);
      setEditingBody("");
      await refreshActiveThread(partnerId);
    } catch {
      setError("Failed to update message");
    }
  };

  const removeMsg = async (id) => {
    const partnerId = activeThread?.partner?.id;
    if (!partnerId) return;
    if (!window.confirm("Delete this message?")) return;

    try {
      await deleteMessage(id);
      await refreshActiveThread(partnerId);
    } catch {
      setError("Failed to delete message");
    }
  };

  return (
    <div className="dashboard-container">
      <PetOwnerSidebar isOpen={isOpen} onClose={close} />

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
            <TopbarUserMenu avatarSrc={userIcon} avatarAlt="User" profilePath="/pet-owner-profile" />
          </div>
        </header>

        <section className="content-body">
          {error && (
            <p style={{ color: "#c62828", marginBottom: "12px" }}>{error}</p>
          )}

          <div style={{ display: "flex", gap: "16px", height: "520px" }}>
            <div
              style={{
                width: "280px",
                background: "white",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #f0f0f0",
                  display: "grid",
                  gap: "8px",
                }}
              >
                <strong style={{ color: "#255065" }}>Start New Chat</strong>
                <select
                  value={selectedContactId}
                  onChange={(e) => setSelectedContactId(e.target.value)}
                >
                  {contacts.map((contact) => (
                    <option key={contact.id} value={contact.id}>
                      {`${contact.firstName || ""} ${contact.lastName || ""}`.trim() ||
                        contact.username}
                    </option>
                  ))}
                </select>
                <button
                  onClick={startThreadWithSelectedContact}
                  style={{
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px",
                    background: "#255065",
                    color: "white",
                  }}
                >
                  Start Chat
                </button>
              </div>
              <div style={{ overflowY: "auto", flex: 1 }}>
                {threads.map((t) => (
                  <div
                    key={t.partner?.id}
                    onClick={() => openThread(t)}
                    style={{
                      padding: "12px 16px",
                      cursor: "pointer",
                      borderBottom: "1px solid #f0f0f0",
                      background:
                        activeThread?.partner?.id === t.partner?.id
                          ? "#f0f9ff"
                          : "white",
                    }}
                  >
                    <strong style={{ fontSize: "0.9rem", color: "#255065" }}>
                      {t.partner?.firstName
                        ? `${t.partner.firstName} ${t.partner.lastName || ""}`.trim()
                        : t.partner?.username}
                    </strong>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "#888",
                        margin: "2px 0 0",
                      }}
                    >
                      {t.lastMessage}
                    </p>
                  </div>
                ))}
              </div>
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
                      fontWeight: 600,
                      color: "#255065",
                    }}
                  >
                    {activeThread.partner?.firstName
                      ? `${activeThread.partner.firstName} ${activeThread.partner.lastName || ""}`.trim()
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
                    {messages.map((m) => {
                      const mine = m.senderId === user?.id;
                      const editing = editingMessageId === m.id;
                      return (
                        <div
                          key={m.id}
                          style={{
                            alignSelf: mine ? "flex-end" : "flex-start",
                            maxWidth: "75%",
                          }}
                        >
                          <div
                            style={{
                              background: mine ? "#255065" : "#f0f9ff",
                              color: mine ? "white" : "#333",
                              padding: "8px 14px",
                              borderRadius: "12px",
                            }}
                          >
                            {editing ? (
                              <div style={{ display: "grid", gap: "6px" }}>
                                <input
                                  value={editingBody}
                                  onChange={(e) =>
                                    setEditingBody(e.target.value)
                                  }
                                />
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "6px",
                                    justifyContent: "flex-end",
                                  }}
                                >
                                  <button
                                    onClick={saveEdit}
                                    style={{
                                      border: "none",
                                      borderRadius: "6px",
                                      padding: "5px 8px",
                                    }}
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingMessageId(null);
                                      setEditingBody("");
                                    }}
                                    style={{
                                      border: "none",
                                      borderRadius: "6px",
                                      padding: "5px 8px",
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <span>{m.body}</span>
                                {mine && (
                                  <div
                                    style={{
                                      display: "flex",
                                      gap: "6px",
                                      justifyContent: "flex-end",
                                      marginTop: "6px",
                                    }}
                                  >
                                    <button
                                      onClick={() => {
                                        setEditingMessageId(m.id);
                                        setEditingBody(m.body);
                                      }}
                                      style={{
                                        border: "none",
                                        borderRadius: "6px",
                                        padding: "5px 8px",
                                      }}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => removeMsg(m.id)}
                                      style={{
                                        border: "none",
                                        borderRadius: "6px",
                                        padding: "5px 8px",
                                        color: "#b42318",
                                      }}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
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
                  Select a conversation or start a new chat
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PetOwnerMessages;
