import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopbarUserMenu from "../../../components/TopbarUserMenu";
import "../../../css/PetOwnerMyPets.css";
import PetOwnerSidebar from "../../../components/PetOwnerSidebar";
import { useSidebar } from "../../../components/useSidebar";
import { createPet, deletePet, getPets, updatePet } from "../../../api/api";

import bellIcon from "../../../assets/Bell_Icon.png";
import userIcon from "../../../assets/Profile.png";

const emptyForm = {
  name: "",
  species: "Dog",
  breed: "",
  age: "",
  gender: "",
  status: "Healthy",
  notes: "",
};

const PetOwnerMyPets = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { isOpen, toggle, close } = useSidebar();

  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!user || user.role !== "pet_owner") {
      navigate("/login");
      return;
    }
    loadPets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPets = async () => {
    setLoading(true);
    setError("");
    try {
      const r = await getPets();
      setPets(r.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load pets");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };

  const openEdit = (pet) => {
    setEditing(pet);
    setForm({
      name: pet.name || "",
      species: pet.species || "Dog",
      breed: pet.breed || "",
      age: pet.age?.toString() || "",
      gender: pet.gender || "",
      status: pet.status || "Healthy",
      notes: pet.notes || "",
    });
    setError("");
    setShowModal(true);
  };

  const submitPet = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.species.trim()) {
      setError("Name and species are required");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        name: form.name.trim(),
        species: form.species.trim(),
        breed: form.breed || null,
        age: form.age ? Number(form.age) : null,
        gender: form.gender || null,
        notes: form.notes || null,
      };

      if (editing) {
        await updatePet(editing.id, payload);
      } else {
        await createPet(payload);
      }

      setShowModal(false);
      setEditing(null);
      setForm(emptyForm);
      await loadPets();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save pet");
    } finally {
      setSaving(false);
    }
  };

  const archivePet = async (pet) => {
    if (!window.confirm(`Archive ${pet.name}?`)) return;
    try {
      await deletePet(pet.id);
      await loadPets();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to archive pet");
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
          <h2>My Pets</h2>
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
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h3 style={{ fontFamily: "Poppins", fontWeight: "600" }}>
              Manage Your Pets
            </h3>
            <button
              className="add-btn"
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
              + Add New Pet
            </button>
          </div>

          {loading && <p>Loading pets...</p>}
          {error && (
            <p style={{ color: "#c62828", marginBottom: "10px" }}>{error}</p>
          )}

          {!loading && pets.length === 0 ? (
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
                You have no active pets. Add one to get started.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
                gap: "16px",
              }}
            >
              {pets.map((pet) => (
                <div
                  key={pet.id}
                  style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                >
                  <h4
                    style={{
                      textAlign: "center",
                      color: "#255065",
                      marginBottom: "4px",
                    }}
                  >
                    {pet.name}
                  </h4>
                  <p
                    style={{
                      textAlign: "center",
                      color: "#888",
                      fontSize: "0.85rem",
                    }}
                  >
                    {pet.species} {pet.breed ? `- ${pet.breed}` : ""}
                  </p>
                  <p
                    style={{
                      textAlign: "center",
                      color: "#888",
                      fontSize: "0.82rem",
                      marginBottom: "10px",
                    }}
                  >
                    {pet.age ? `${pet.age} yr(s)` : "Age not set"}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      onClick={() => openEdit(pet)}
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
                      onClick={() => archivePet(pet)}
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
              width: "min(640px,100%)",
              background: "#fff",
              borderRadius: "14px",
              padding: "20px",
              boxShadow: "0 20px 45px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ marginBottom: "14px", color: "#1f495f" }}>
              {editing ? "Edit Pet" : "Add Pet"}
            </h3>
            <form onSubmit={submitPet} style={{ display: "grid", gap: "10px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}
              >
                <input
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                />
                <input
                  placeholder="Species"
                  value={form.species}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, species: e.target.value }))
                  }
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}
              >
                <input
                  placeholder="Breed"
                  value={form.breed}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, breed: e.target.value }))
                  }
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Age"
                  value={form.age}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, age: e.target.value }))
                  }
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}
              >
                <input
                  placeholder="Gender"
                  value={form.gender}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, gender: e.target.value }))
                  }
                />
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, status: e.target.value }))
                  }
                >
                  <option value="Healthy">Healthy</option>
                  <option value="UnderTreatment">UnderTreatment</option>
                  <option value="Deceased">Deceased</option>
                </select>
              </div>
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

export default PetOwnerMyPets;
