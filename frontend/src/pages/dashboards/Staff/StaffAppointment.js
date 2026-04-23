import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopbarUserMenu from "../../../components/TopbarUserMenu";
import "../../../css/StaffAppointment.css";
import StaffSidebar from "../../../components/StaffSidebar";
import { useSidebar } from "../../../components/useSidebar";
import {
  createAppointment,
  deleteAppointment,
  getAppointments,
  getAvailableVets,
  getPets,
  getVetAvailableSlots,
  updateAppointment,
} from "../../../api/api";

// ASSETS
import bellIcon from "../../../assets/Bell_Icon.png";
import userIcon from "../../../assets/Profile.png";

const StaffAppointment = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { isOpen, toggle, close } = useSidebar();
  const [viewMode, setViewMode] = useState("calendar");
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [pets, setPets] = useState([]);
  const [vets, setVets] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    petId: "",
    vetId: "",
    date: "",
    slot: "",
    reason: "",
    notes: "",
    status: "Pending",
  });

  const ensureCurrentSlotOption = (slotList, currentSlotIso) => {
    if (!currentSlotIso) return slotList;
    const exists = slotList.some((slot) => slot.startsAt === currentSlotIso);
    if (exists) return slotList;

    const merged = [
      {
        startsAt: currentSlotIso,
        endsAt: currentSlotIso,
        isCurrent: true,
      },
      ...slotList,
    ];

    return merged.sort(
      (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
    );
  };

  useEffect(() => {
    if (!user || user.role !== "staff") {
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
      const [appointmentRes, petRes, vetRes] = await Promise.all([
        getAppointments(),
        getPets(),
        getAvailableVets(),
      ]);
      setAppointments(appointmentRes.data || []);
      setPets(petRes.data || []);
      setVets(vetRes.data || []);
    } catch {
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const fetchSlots = async (vetId, date, currentSlotIso = "") => {
    if (!vetId || !date) {
      setSlots([]);
      return;
    }
    try {
      const res = await getVetAvailableSlots(vetId, date);
      setSlots(ensureCurrentSlotOption(res.data.slots || [], currentSlotIso));
    } catch (err) {
      setSlots([]);
      setError(
        err.response?.data?.message || "Failed to fetch available slots",
      );
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setSaving(false);
    setSlots([]);
    setError("");
  };

  const openCreate = () => {
    setEditing(null);
    setForm({
      petId: pets[0]?.id || "",
      vetId: vets[0]?.id || "",
      date: "",
      slot: "",
      reason: "",
      notes: "",
      status: "Pending",
    });
    setError("");
    setShowModal(true);
  };

  const openEdit = async (appointment) => {
    const currentSlotIso = new Date(appointment.scheduledAt).toISOString();
    const currentDate = currentSlotIso.slice(0, 10);

    setEditing(appointment);
    setForm({
      petId: appointment.petId,
      vetId: appointment.vetId || "",
      date: currentDate,
      slot: currentSlotIso,
      reason: appointment.reason || "",
      notes: appointment.notes || "",
      status: appointment.status || "Pending",
    });
    setError("");
    setShowModal(true);

    await fetchSlots(appointment.vetId, currentDate, currentSlotIso);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "vetId" || name === "date") {
      const nextVetId = name === "vetId" ? value : form.vetId;
      const nextDate = name === "date" ? value : form.date;
      setForm((prev) => ({ ...prev, slot: "" }));

      let currentSlotIso = "";
      if (editing && nextVetId === editing.vetId) {
        const editingSlotIso = new Date(editing.scheduledAt).toISOString();
        const editingDate = editingSlotIso.slice(0, 10);
        if (nextDate === editingDate) {
          currentSlotIso = editingSlotIso;
        }
      }

      fetchSlots(nextVetId, nextDate, currentSlotIso);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.petId || !form.vetId || !form.slot) {
      setError("Pet, veterinarian, date, and available slot are required");
      return;
    }

    setSaving(true);
    setError("");
    try {
      if (editing) {
        await updateAppointment(editing.id, {
          vetId: form.vetId,
          scheduledAt: form.slot,
          reason: form.reason,
          notes: form.notes,
          status: form.status,
        });
      } else {
        await createAppointment({
          petId: form.petId,
          vetId: form.vetId,
          scheduledAt: form.slot,
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

  const handleDelete = async (appointment) => {
    if (!window.confirm("Delete this appointment?")) return;
    try {
      await deleteAppointment(appointment.id);
      await loadData();
    } catch {
      setError("Failed to delete appointment");
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    const ownerName =
      `${a.owner?.firstName || ""} ${a.owner?.lastName || ""}`.trim() ||
      a.owner?.username ||
      "";
    const query = search.toLowerCase();
    return (
      a.pet?.name?.toLowerCase().includes(query) ||
      ownerName.toLowerCase().includes(query) ||
      (a.status || "").toLowerCase().includes(query)
    );
  });

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

  const shiftMonth = (delta) => {
    setCalendarDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1),
    );
  };

  const monthLabel = calendarDate.toLocaleString([], {
    month: "long",
    year: "numeric",
  });

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
          <h2>Appointments</h2>
          <div className="top-bar-right">
            <button
              className="notif-btn"
              onClick={() => navigate("/staff-notifications")}
            >
              <img src={bellIcon} alt="Notif" />
            </button>
            <TopbarUserMenu avatarSrc={userIcon} avatarAlt="Profile" profilePath="/staff-profile" />
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
            <div className="appointment-actions">
              <input
                type="text"
                className="apt-search"
                placeholder="Search pet, owner, or status"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="add-apt-btn" onClick={openCreate}>
                + Book Appointment
              </button>
            </div>
          </div>

          {loading && (
            <p className="list-placeholder">Loading appointments...</p>
          )}
          {!loading && error && <p className="modal-error">{error}</p>}

          {!loading && viewMode === "calendar" ? (
            <div className="calendar-container">
              <div className="calendar-month-header">
                <h3>{monthLabel}</h3>
                <div className="month-nav">
                  <button onClick={() => shiftMonth(-1)}>&lt; Prev</button>
                  <button onClick={() => shiftMonth(1)}>Next &gt;</button>
                </div>
              </div>
              <div className="calendar-grid">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div key={day} className="weekday-label">
                      {day}
                    </div>
                  ),
                )}
                {Array.from({ length: firstWeekday }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="calendar-day empty" />
                ))}
                {days.map((d) => (
                  <div key={d} className="calendar-day">
                    <span className="day-num">{d}</span>
                    <div className="day-events">
                      {filteredAppointments
                        .filter((a) => {
                          const scheduled = new Date(a.scheduledAt);
                          return (
                            scheduled.getFullYear() ===
                              calendarDate.getFullYear() &&
                            scheduled.getMonth() === calendarDate.getMonth() &&
                            scheduled.getDate() === d
                          );
                        })
                        .map((apt) => (
                          <div
                            key={apt.id}
                            className={`event-item ${(apt.status || "").toLowerCase()}`}
                            title={`${apt.pet?.name || "Pet"} - ${apt.status}`}
                          >
                            {new Date(apt.scheduledAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            {apt.pet?.name}
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="list-view-container">
              <table className="appointment-table">
                <thead>
                  <tr>
                    <th>Pet</th>
                    <th>Owner</th>
                    <th>Date & Time</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((apt) => (
                    <tr key={apt.id}>
                      <td>{apt.pet?.name || "-"}</td>
                      <td>
                        {`${apt.owner?.firstName || ""} ${apt.owner?.lastName || ""}`.trim() ||
                          apt.owner?.username ||
                          "-"}
                      </td>
                      <td>{new Date(apt.scheduledAt).toLocaleString()}</td>
                      <td>{apt.reason || "-"}</td>
                      <td>
                        <span
                          className={`apt-status ${(apt.status || "").toLowerCase()}`}
                        >
                          {apt.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button
                            className="btn-edit"
                            onClick={() => openEdit(apt)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-remove"
                            onClick={() => handleDelete(apt)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!filteredAppointments.length && (
                <p className="list-placeholder">No appointments found.</p>
              )}
            </div>
          )}
        </section>
      </main>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <form className="user-modal-form" onSubmit={onSubmit}>
              <h3>{editing ? "Edit Appointment" : "Book Appointment"}</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Pet</label>
                  <select
                    name="petId"
                    value={form.petId}
                    onChange={onChange}
                    required
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
                  <label>Veterinarian</label>
                  <select
                    name="vetId"
                    value={form.vetId}
                    onChange={onChange}
                    required
                  >
                    <option value="">Select veterinarian</option>
                    {vets.map((vet) => (
                      <option key={vet.id} value={vet.id}>
                        {`${vet.firstName || ""} ${vet.lastName || ""}`.trim() ||
                          vet.username}
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
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Available Slot</label>
                  <select
                    name="slot"
                    value={form.slot}
                    onChange={onChange}
                    required
                  >
                    <option value="">Select time slot</option>
                    {slots.map((slot) => (
                      <option key={slot.startsAt} value={slot.startsAt}>
                        {new Date(slot.startsAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {slot.isCurrent ? " (current)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Reason</label>
                <input name="reason" value={form.reason} onChange={onChange} />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea name="notes" value={form.notes} onChange={onChange} />
              </div>
              {error && <p className="modal-error">{error}</p>}
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

export default StaffAppointment;
