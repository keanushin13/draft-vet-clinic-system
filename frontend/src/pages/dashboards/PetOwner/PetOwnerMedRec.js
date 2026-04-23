import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/PetOwnerMedRec.css";
import PetOwnerSidebar from "../../../components/PetOwnerSidebar";
import { useSidebar } from "../../../components/useSidebar";
import {
  createMedicalRecord,
  deleteMedicalRecord,
  getAppointments,
  getMedicalRecords,
  getPets,
  updateMedicalRecord,
} from "../../../api/api";

import bellIcon from "../../../assets/Bell_Icon.png";
import userIcon from "../../../assets/Profile.png";

const initialForm = {
  petId: "",
  appointmentId: "",
  diagnosis: "",
  treatment: "",
  prescription: "",
  notes: "",
  status: "Finalized",
  followUpDate: "",
};

const PetOwnerMedRec = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { isOpen, toggle, close } = useSidebar();

  const [records, setRecords] = useState([]);
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!user || user.role !== "pet_owner") {
      navigate("/login");
      return;
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [recordRes, petRes, apptRes] = await Promise.all([
        getMedicalRecords(),
        getPets(),
        getAppointments(),
      ]);
      setRecords(recordRes.data || []);
      setPets(petRes.data || []);
      setAppointments(apptRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load medical records");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({
      ...initialForm,
      petId: pets[0]?.id || "",
      appointmentId: appointments[0]?.id || "",
    });
    setShowModal(true);
    setError("");
  };

  const openEdit = (record) => {
    setEditing(record);
    setForm({
      petId: record.petId || "",
      appointmentId: record.appointmentId || "",
      diagnosis: record.diagnosis || "",
      treatment: record.treatment || "",
      prescription: record.prescription || "",
      notes: record.notes || "",
      status: record.status || "Finalized",
      followUpDate: record.followUpDate
        ? new Date(record.followUpDate).toISOString().slice(0, 10)
        : "",
    });
    setShowModal(true);
    setError("");
  };

  const submitRecord = async (e) => {
    e.preventDefault();
    if (!form.petId || !form.appointmentId || !form.diagnosis.trim()) {
      setError("Pet, appointment, and diagnosis are required");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        diagnosis: form.diagnosis.trim(),
        treatment: form.treatment || null,
        prescription: form.prescription || null,
        notes: form.notes || null,
        followUpDate: form.followUpDate || null,
      };

      if (editing) {
        await updateMedicalRecord(editing.id, payload);
      } else {
        await createMedicalRecord(payload);
      }

      setShowModal(false);
      setEditing(null);
      setForm(initialForm);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save medical record");
    } finally {
      setSaving(false);
    }
  };

  const removeRecord = async (record) => {
    if (!window.confirm("Delete this medical record?")) return;
    try {
      await deleteMedicalRecord(record.id);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete record");
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
          <h2>Medical Records</h2>
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
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h3 style={{ fontFamily: "Poppins", fontWeight: "600" }}>
              Health History
            </h3>
            <button
              className="download-btn"
              style={{
                backgroundColor: "#438fb5",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
              onClick={openCreate}
            >
              + Add Record
            </button>
          </div>

          {loading && <p>Loading records...</p>}
          {error && (
            <p style={{ color: "#c62828", marginBottom: "10px" }}>{error}</p>
          )}

          {!loading && records.length === 0 ? (
            <div
              className="dashboard-welcome-card"
              style={{
                background: "white",
                padding: "30px",
                borderRadius: "15px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              <p style={{ color: "#555" }}>No medical records found yet.</p>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {records.map((r) => (
                <div
                  key={r.id}
                  style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <strong style={{ color: "#255065" }}>
                        {r.pet?.name}
                      </strong>
                      <div style={{ color: "#666", fontSize: "0.85rem" }}>
                        {r.diagnosis}
                      </div>
                      <div style={{ color: "#888", fontSize: "0.8rem" }}>
                        {new Date(r.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span
                      style={{
                        padding: "5px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        background:
                          r.status === "Finalized" ? "#dcfce7" : "#fef9c3",
                        color: r.status === "Finalized" ? "#166534" : "#854d0e",
                      }}
                    >
                      {r.status}
                    </span>
                  </div>

                  <div
                    style={{ display: "flex", gap: "8px", marginTop: "10px" }}
                  >
                    <button
                      onClick={() => openEdit(r)}
                      style={{
                        border: "none",
                        background: "#e4e6ea",
                        color: "#505866",
                        padding: "6px 10px",
                        borderRadius: "7px",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeRecord(r)}
                      style={{
                        border: "none",
                        background: "#fbeef0",
                        color: "#ef575a",
                        padding: "6px 10px",
                        borderRadius: "7px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.45)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
        >
          <div
            style={{
              width: "min(720px,100%)",
              background: "#fff",
              borderRadius: "14px",
              padding: "20px",
              boxShadow: "0 20px 45px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ marginBottom: "14px", color: "#1f495f" }}>
              {editing ? "Edit Medical Record" : "Add Medical Record"}
            </h3>
            <form
              onSubmit={submitRecord}
              style={{ display: "grid", gap: "10px" }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}
              >
                <select
                  value={form.petId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, petId: e.target.value }))
                  }
                  required
                >
                  <option value="">Select pet</option>
                  {pets.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <select
                  value={form.appointmentId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, appointmentId: e.target.value }))
                  }
                  required
                >
                  <option value="">Select appointment</option>
                  {appointments.map((a) => (
                    <option key={a.id} value={a.id}>
                      {new Date(a.scheduledAt).toLocaleString()} - {a.pet?.name}
                    </option>
                  ))}
                </select>
              </div>

              <input
                placeholder="Diagnosis"
                value={form.diagnosis}
                onChange={(e) =>
                  setForm((p) => ({ ...p, diagnosis: e.target.value }))
                }
                required
              />
              <input
                placeholder="Treatment"
                value={form.treatment}
                onChange={(e) =>
                  setForm((p) => ({ ...p, treatment: e.target.value }))
                }
              />
              <input
                placeholder="Prescription"
                value={form.prescription}
                onChange={(e) =>
                  setForm((p) => ({ ...p, prescription: e.target.value }))
                }
              />
              <textarea
                rows={3}
                placeholder="Notes"
                value={form.notes}
                onChange={(e) =>
                  setForm((p) => ({ ...p, notes: e.target.value }))
                }
              />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}
              >
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, status: e.target.value }))
                  }
                >
                  <option value="Finalized">Finalized</option>
                  <option value="FollowUp">FollowUp</option>
                </select>
                <input
                  type="date"
                  value={form.followUpDate}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, followUpDate: e.target.value }))
                  }
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    border: "none",
                    borderRadius: "8px",
                    padding: "9px 14px",
                    background: "#eff4f8",
                    color: "#1f495f",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    border: "none",
                    borderRadius: "8px",
                    padding: "9px 14px",
                    background: "#2e86ab",
                    color: "#fff",
                  }}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetOwnerMedRec;
