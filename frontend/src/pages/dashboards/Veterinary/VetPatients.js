import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopbarUserMenu from "../../../components/TopbarUserMenu";
import "../../../css/VetPatients.css";
import VetSidebar from "../../../components/VetSidebar";
import { useSidebar } from "../../../components/useSidebar";
import { createPet, deletePet, getPets, updatePet } from "../../../api/api";

// ASSETS
import bellIcon from "../../../assets/Bell_Icon.png";
import userIcon from "../../../assets/Profile.png";

const VetPatients = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { isOpen, toggle, close } = useSidebar();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    gender: "",
    status: "Healthy",
    ownerId: "",
    notes: "",
  });

  // FUNCTION: Guard Clause (Matches your PetOwner format)
  useEffect(() => {
    if (!user || user.role !== "veterinarian") {
      navigate("/login");
      return;
    }
    loadPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPatients = async () => {
    setLoading(true);
    setError("");
    try {
      const r = await getPets();
      setPatients(r.data || []);
    } catch {
      setError("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  const ownerOptions = Array.from(
    new Map(
      patients.filter((p) => p.owner).map((p) => [p.owner.id, p.owner]),
    ).values(),
  );

  const filteredPatients = patients.filter((p) => {
    const ownerName =
      `${p.owner?.firstName || ""} ${p.owner?.lastName || ""}`.trim() ||
      p.owner?.username ||
      "";
    const q = search.toLowerCase();
    return (
      (p.name || "").toLowerCase().includes(q) ||
      (p.species || "").toLowerCase().includes(q) ||
      ownerName.toLowerCase().includes(q)
    );
  });

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: "",
      species: "",
      breed: "",
      age: "",
      gender: "",
      status: "Healthy",
      ownerId: ownerOptions[0]?.id || "",
      notes: "",
    });
    setError("");
    setShowModal(true);
  };

  const openEdit = (pet) => {
    setEditing(pet);
    setForm({
      name: pet.name || "",
      species: pet.species || "",
      breed: pet.breed || "",
      age: pet.age ?? "",
      gender: pet.gender || "",
      status: pet.status || "Healthy",
      ownerId: pet.ownerId || "",
      notes: pet.notes || "",
    });
    setError("");
    setShowModal(true);
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

  const submitPatient = async (e) => {
    e.preventDefault();
    if (!form.name || !form.species || !form.ownerId) {
      setError("Name, species, and owner are required");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        age: form.age === "" ? null : Number(form.age),
      };
      if (editing) {
        await updatePet(editing.id, payload);
      } else {
        await createPet(payload);
      }
      closeModal();
      await loadPatients();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save patient");
    } finally {
      setSaving(false);
    }
  };

  const archivePatient = async (pet) => {
    if (!window.confirm(`Archive ${pet.name}?`)) return;
    try {
      await deletePet(pet.id);
      await loadPatients();
    } catch {
      setError("Failed to archive patient");
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
          <h2>Patient Management</h2>
          <div className="top-bar-right">
            <button
              className="notif-btn"
              onClick={() => navigate("/vet-notifications")}
            >
              <img src={bellIcon} alt="Notifications" />
            </button>
            <TopbarUserMenu avatarSrc={userIcon} avatarAlt="User" profilePath="/vet-profile" />
          </div>
        </header>

        <section className="content-body">
          <div className="patients-actions">
            <input
              className="patients-search"
              placeholder="Search by pet, species, or owner"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="add-patient-btn" onClick={openCreate}>
              + Add Patient
            </button>
          </div>

          <div className="patients-list-card">
            <table className="patients-table">
              <thead>
                <tr>
                  <th>Pet Name</th>
                  <th>Species</th>
                  <th>Breed</th>
                  <th>Owner</th>
                  <th>Last Visit</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: "600", color: "#255065" }}>
                      {p.name}
                    </td>
                    <td>{p.species}</td>
                    <td>{p.breed}</td>
                    <td>
                      {p.owner
                        ? `${p.owner.firstName ?? ""} ${p.owner.lastName ?? ""}`.trim() ||
                          p.owner.username
                        : "-"}
                    </td>
                    <td>
                      {p.updatedAt
                        ? new Date(p.updatedAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>
                      <div className="row-actions">
                        <button className="row-btn" onClick={() => openEdit(p)}>
                          Edit
                        </button>
                        <button
                          className="row-btn row-btn-danger"
                          onClick={() => archivePatient(p)}
                        >
                          Archive
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {loading && <p className="list-feedback">Loading patients...</p>}
            {!loading && !filteredPatients.length && (
              <p className="list-feedback">No patients found.</p>
            )}
            {error && <p className="list-error">{error}</p>}
          </div>
        </section>
      </main>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <form className="user-modal-form" onSubmit={submitPatient}>
              <h3>{editing ? "Edit Patient" : "Add Patient"}</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Species</label>
                  <input
                    name="species"
                    value={form.species}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Breed</label>
                  <input name="breed" value={form.breed} onChange={onChange} />
                </div>
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    min="0"
                    name="age"
                    value={form.age}
                    onChange={onChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Gender</label>
                  <input
                    name="gender"
                    value={form.gender}
                    onChange={onChange}
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={form.status} onChange={onChange}>
                    <option value="Healthy">Healthy</option>
                    <option value="UnderTreatment">UnderTreatment</option>
                    <option value="Deceased">Deceased</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Owner</label>
                <select
                  name="ownerId"
                  value={form.ownerId}
                  onChange={onChange}
                  required
                >
                  <option value="">Select owner</option>
                  {ownerOptions.map((owner) => (
                    <option key={owner.id} value={owner.id}>
                      {`${owner.firstName || ""} ${owner.lastName || ""}`.trim() ||
                        owner.username}
                    </option>
                  ))}
                </select>
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

export default VetPatients;
