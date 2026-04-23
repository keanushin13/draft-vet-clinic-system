import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopbarUserMenu from "../../../components/TopbarUserMenu";
import "../../../css/PetOwnerAppointment.css";
import PetOwnerSidebar from "../../../components/PetOwnerSidebar";
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

import bellIcon from "../../../assets/Bell_Icon.png";
import userIcon from "../../../assets/Profile.png";

const PetOwnerAppointment = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { isOpen, toggle, close } = useSidebar();

  const [appointments, setAppointments] = useState([]);
  const [pets, setPets] = useState([]);
  const [vets, setVets] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    petId: "",
    vetId: "",
    date: "",
    slot: "",
    reason: "",
    notes: "",
  });

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
      const [apptRes, petRes, vetRes] = await Promise.all([
        getAppointments(),
        getPets(),
        getAvailableVets(),
      ]);
      setAppointments(apptRes.data || []);
      setPets(petRes.data || []);
      const vetList = vetRes.data || [];
      setVets(vetList);
      setForm((prev) => ({
        ...prev,
        petId: prev.petId || petRes.data?.[0]?.id || "",
        vetId: prev.vetId || vetList?.[0]?.id || "",
      }));
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load appointment data",
      );
    } finally {
      setLoading(false);
    }
  };

  const openBookingModal = () => {
    setEditing(null);
    setShowModal(true);
    setError("");
    setSlots([]);
    setForm((prev) => ({
      ...prev,
      petId: prev.petId || pets[0]?.id || "",
      vetId: prev.vetId || vets[0]?.id || "",
      date: "",
      slot: "",
      reason: "",
      notes: "",
    }));
  };

  const openEditModal = async (appointment) => {
    const iso = new Date(appointment.scheduledAt).toISOString();
    const date = iso.slice(0, 10);
    setEditing(appointment);
    setShowModal(true);
    setError("");
    setForm({
      petId: appointment.petId,
      vetId: appointment.vetId || "",
      date,
      slot: iso,
      reason: appointment.reason || "",
      notes: appointment.notes || "",
    });

    await fetchSlots(appointment.vetId, date);
  };

  const fetchSlots = async (vetId, date) => {
    if (!vetId || !date) {
      setSlots([]);
      return;
    }
    try {
      const res = await getVetAvailableSlots(vetId, date);
      setSlots(res.data.slots || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch available slots",
      );
      setSlots([]);
    }
  };

  const onFieldChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "vetId" || name === "date") {
      const vetId = name === "vetId" ? value : form.vetId;
      const date = name === "date" ? value : form.date;
      setForm((prev) => ({ ...prev, slot: "" }));
      fetchSlots(vetId, date);
    }
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    if (!form.petId || !form.vetId || !form.slot) {
      setError("Please select pet, veterinarian, and time slot");
      return;
    }

    setBooking(true);
    setError("");
    try {
      if (editing) {
        await updateAppointment(editing.id, {
          vetId: form.vetId,
          scheduledAt: form.slot,
          reason: form.reason,
          notes: form.notes,
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
      setShowModal(false);
      setEditing(null);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create appointment");
    } finally {
      setBooking(false);
    }
  };

  const cancelAppointment = async (appointment) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      await deleteAppointment(appointment.id);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel appointment");
    }
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
          <h2>Appointments</h2>
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
          <div
            className="appointment-header-action"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h3 style={{ fontFamily: "Poppins", fontWeight: "600" }}>
              Your Scheduled Visits
            </h3>
            <button className="book-btn" onClick={openBookingModal}>
              + Book New Appointment
            </button>
          </div>

          {loading && <p>Loading appointments...</p>}
          {error && <p className="appointment-error">{error}</p>}

          {appointments.length === 0 ? (
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
                No appointments found. Start by booking your first visit!
              </p>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {appointments.map((a) => (
                <div
                  key={a.id}
                  style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong style={{ color: "#255065" }}>{a.pet?.name}</strong>
                    <div style={{ color: "#666", fontSize: "0.85rem" }}>
                      {new Date(a.scheduledAt).toLocaleString()}
                    </div>
                    <div style={{ color: "#888", fontSize: "0.8rem" }}>
                      {a.reason}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        marginTop: "8px",
                      }}
                    >
                      <button
                        onClick={() => openEditModal(a)}
                        style={{
                          border: "none",
                          background: "#e4e6ea",
                          color: "#505866",
                          padding: "6px 10px",
                          borderRadius: "7px",
                          cursor: "pointer",
                        }}
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => cancelAppointment(a)}
                        style={{
                          border: "none",
                          background: "#fbeef0",
                          color: "#ef575a",
                          padding: "6px 10px",
                          borderRadius: "7px",
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                  <span
                    style={{
                      padding: "5px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      background:
                        a.status === "Confirmed" ? "#dcfce7" : "#fef9c3",
                      color: a.status === "Confirmed" ? "#166534" : "#854d0e",
                    }}
                  >
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {showModal && (
        <div className="po-modal-backdrop">
          <div className="po-modal-card">
            <h3>{editing ? "Update Appointment" : "Book Appointment"}</h3>

            <form onSubmit={submitBooking} className="po-booking-form">
              <label>
                Pet
                <select
                  name="petId"
                  value={form.petId}
                  onChange={onFieldChange}
                  required
                >
                  {pets.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Veterinarian
                <select
                  name="vetId"
                  value={form.vetId}
                  onChange={onFieldChange}
                  required
                >
                  {vets.map((v) => (
                    <option key={v.id} value={v.id}>
                      {`${v.firstName || ""} ${v.lastName || ""}`.trim() ||
                        v.username}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Date
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={onFieldChange}
                  required
                />
              </label>

              <label>
                Available Time Slot
                <select
                  name="slot"
                  value={form.slot}
                  onChange={onFieldChange}
                  required
                >
                  <option value="">Select a slot</option>
                  {slots.map((s) => (
                    <option key={s.startsAt} value={s.startsAt}>
                      {new Date(s.startsAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Reason
                <input
                  type="text"
                  name="reason"
                  value={form.reason}
                  onChange={onFieldChange}
                  placeholder="Checkup, follow-up, vaccination"
                />
              </label>

              <label>
                Notes
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={onFieldChange}
                  rows={3}
                />
              </label>

              {error && <p className="appointment-error">{error}</p>}

              <div className="po-modal-actions">
                <button
                  type="button"
                  className="po-btn po-btn-ghost"
                  onClick={() => {
                    setShowModal(false);
                    setEditing(null);
                  }}
                  disabled={booking}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="po-btn po-btn-primary"
                  disabled={booking}
                >
                  {booking
                    ? editing
                      ? "Updating..."
                      : "Booking..."
                    : editing
                      ? "Update Appointment"
                      : "Book Appointment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetOwnerAppointment;
