import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/VetCalendar.css";
import VetSidebar from "../../../components/VetSidebar";
import { useSidebar } from "../../../components/useSidebar";
import {
  createAppointment,
  deleteAppointment,
  getAppointments,
  getPets,
  updateAppointment,
} from "../../../api/api";

// ASSETS
import bellIcon from "../../../assets/Bell_Icon.png";
import userIcon from "../../../assets/Profile.png";

const VetCalendar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { isOpen, toggle, close } = useSidebar();

  const [appointments, setAppointments] = useState([]);
  const [pets, setPets] = useState([]);
  const [viewMode, setViewMode] = useState("calendar");
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    petId: "",
    scheduledAt: "",
    reason: "",
    notes: "",
    status: "Pending",
  });

  // FUNCTION: Security Guard (Matches PetOwner logic)
  useEffect(() => {
    if (!user || user.role !== "veterinarian") {
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
      const [aptRes, petRes] = await Promise.all([
        getAppointments(),
        getPets(),
      ]);
      setAppointments(aptRes.data || []);
      setPets(petRes.data || []);
    } catch {
      setError("Failed to load calendar data");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({
      petId: pets[0]?.id || "",
      scheduledAt: "",
      reason: "",
      notes: "",
      status: "Pending",
    });
    setShowModal(true);
    setError("");
  };

  const openEdit = (apt) => {
    setEditing(apt);
    setForm({
      petId: apt.petId,
      scheduledAt: new Date(apt.scheduledAt).toISOString().slice(0, 16),
      reason: apt.reason || "",
      notes: apt.notes || "",
      status: apt.status || "Pending",
    });
    setShowModal(true);
    setError("");
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setSaving(false);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitAppointment = async (e) => {
    e.preventDefault();
    if (!form.petId || !form.scheduledAt) {
      setError("Pet and schedule are required");
      return;
    }

    setSaving(true);
    setError("");
    try {
      if (editing) {
        await updateAppointment(editing.id, {
          scheduledAt: form.scheduledAt,
          reason: form.reason,
          notes: form.notes,
          status: form.status,
        });
      } else {
        await createAppointment({
          petId: form.petId,
          scheduledAt: form.scheduledAt,
          reason: form.reason,
          notes: form.notes,
        });
      }
      closeModal();
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save appointment");
    } finally {
      setSaving(false);
    }
  };

  const removeAppointment = async (apt) => {
    if (!window.confirm("Delete this appointment?")) return;
    try {
      await deleteAppointment(apt.id);
      await loadData();
    } catch {
      setError("Failed to delete appointment");
    }
  };

  const monthStart = new Date(
    calendarDate.getFullYear(),
    calendarDate.getMonth(),
    1,
  );
  const daysInMonth = new Date(
    calendarDate.getFullYear(),
    calendarDate.getMonth() + 1,
    0,
  ).getDate();
  const firstWeekday = monthStart.getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const monthLabel = calendarDate.toLocaleString([], {
    month: "long",
    year: "numeric",
  });

  const monthAppointments = appointments.filter((a) => {
    const d = new Date(a.scheduledAt);
    return (
      d.getFullYear() === calendarDate.getFullYear() &&
      d.getMonth() === calendarDate.getMonth()
    );
  });

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
          <h2>Vet Schedule</h2>
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

        <section className="content-body">
          <div className="calendar-controls">
            <div className="view-toggle">
              <button
                className={viewMode === "calendar" ? "active" : ""}
                onClick={() => setViewMode("calendar")}
              >
                Calendar View
              </button>
              <button
                className={viewMode === "list" ? "active" : ""}
                onClick={() => setViewMode("list")}
              >
                List View
              </button>
            </div>
            <button className="add-apt-btn" onClick={openCreate}>
              + Add Appointment
            </button>
          </div>

          {viewMode === "calendar" ? (
            <div className="calendar-container-card">
              <div className="calendar-header">
                <h4>{monthLabel}</h4>
                <div className="month-nav">
                  <button
                    className="nav-btn"
                    onClick={() =>
                      setCalendarDate(
                        (prev) =>
                          new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
                      )
                    }
                  >
                    Prev
                  </button>
                  <button
                    className="nav-btn"
                    onClick={() =>
                      setCalendarDate(
                        (prev) =>
                          new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
                      )
                    }
                  >
                    Next
                  </button>
                </div>
              </div>

              <div className="calendar-grid-placeholder">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div key={day} className="weekday-label">
                      {day}
                    </div>
                  ),
                )}
                {Array.from({ length: firstWeekday }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="day-cell empty" />
                ))}
                {days.map((day) => {
                  const dayApts = monthAppointments.filter(
                    (a) => new Date(a.scheduledAt).getDate() === day,
                  );
                  return (
                    <div key={day} className="day-cell">
                      <div className="day-number">{day}</div>
                      {dayApts.map((a) => (
                        <button
                          key={a.id}
                          className="event-chip"
                          onClick={() => openEdit(a)}
                          title={`${a.pet?.name || "Pet"} - ${a.status}`}
                        >
                          {a.pet?.name}
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="calendar-container-card">
              <table className="appointment-table">
                <thead>
                  <tr>
                    <th>Pet</th>
                    <th>Scheduled At</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {monthAppointments.map((apt) => (
                    <tr key={apt.id}>
                      <td>{apt.pet?.name || "-"}</td>
                      <td>{new Date(apt.scheduledAt).toLocaleString()}</td>
                      <td>{apt.reason || "-"}</td>
                      <td>{apt.status}</td>
                      <td>
                        <div className="row-actions">
                          <button
                            className="row-btn"
                            onClick={() => openEdit(apt)}
                          >
                            Edit
                          </button>
                          <button
                            className="row-btn row-btn-danger"
                            onClick={() => removeAppointment(apt)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {loading && <p className="list-feedback">Loading appointments...</p>}
          {!loading && !monthAppointments.length && (
            <p className="list-feedback">No appointments in this month.</p>
          )}
          {error && <p className="list-error">{error}</p>}
        </section>
      </main>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <form className="user-modal-form" onSubmit={submitAppointment}>
              <h3>{editing ? "Edit Appointment" : "Add Appointment"}</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Pet</label>
                  <select
                    name="petId"
                    value={form.petId}
                    onChange={onChange}
                    required
                    disabled={Boolean(editing)}
                  >
                    <option value="">Select pet</option>
                    {pets.map((pet) => (
                      <option key={pet.id} value={pet.id}>
                        {pet.name} ({pet.species})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={onChange}
                    disabled={!editing}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Scheduled At</label>
                <input
                  type="datetime-local"
                  name="scheduledAt"
                  value={form.scheduledAt}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Reason</label>
                <input name="reason" value={form.reason} onChange={onChange} />
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea name="notes" value={form.notes} onChange={onChange} />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn" disabled={saving}>
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

export default VetCalendar;
