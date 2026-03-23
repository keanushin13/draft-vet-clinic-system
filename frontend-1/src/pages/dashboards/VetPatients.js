import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/VetPatients.css";

// ASSETS
import appointmentIcon from "../../assets/Appointment_Icon.png";
import bellIcon from "../../assets/Bell_Icon.png";
import dashboardIcon from "../../assets/Dashboard_Icon.png";
import medicalIcon from "../../assets/Medical_Icon.png";
import messageIcon from "../../assets/Message_Icon.png";
import pawLogo from "../../assets/paw.png";
import inventoryIcon from "../../assets/payment_icon.png";
import patientsIcon from "../../assets/Pets_Icon.png";
import userIcon from "../../assets/User_Icon.png";

const VetPatients = () => {
  const navigate = useNavigate();

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const [patients, setPatients] = useState(() => {
    try {
      const savedPatients = JSON.parse(localStorage.getItem("vetPatients") || "null");

      if (Array.isArray(savedPatients) && savedPatients.length > 0) {
        return savedPatients;
      }
    } catch {
      // ignore parse error
    }

    return [
      {
        id: 1,
        name: "Max",
        species: "Dog",
        breed: "Golden Retriever",
        owner: "Juan Dela Cruz",
        lastVisit: "2026-02-01",
      },
      {
        id: 2,
        name: "Luna",
        species: "Cat",
        breed: "Siamese",
        owner: "Maria Santos",
        lastVisit: "2026-01-28",
      },
      {
        id: 3,
        name: "Cooper",
        species: "Dog",
        breed: "Beagle",
        owner: "Ricardo Ramos",
        lastVisit: "2026-02-03",
      },
      {
        id: 4,
        name: "Bella",
        species: "Dog",
        breed: "Poodle",
        owner: "Elena Gomez",
        lastVisit: "2026-01-15",
      },
    ];
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    owner: "",
    lastVisit: "",
  });

  useEffect(() => {
    if (!user || user.role !== "veterinarian") {
      navigate("/login");
    }
  }, [navigate, user]);

  useEffect(() => {
    localStorage.setItem("vetPatients", JSON.stringify(patients));
  }, [patients]);

  const openAddModal = () => {
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setFormData({
      name: "",
      species: "",
      breed: "",
      owner: "",
      lastVisit: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddPatient = (e) => {
    e.preventDefault();

    const trimmedName = formData.name.trim();
    const trimmedSpecies = formData.species.trim();
    const trimmedBreed = formData.breed.trim();
    const trimmedOwner = formData.owner.trim();
    const trimmedLastVisit = formData.lastVisit.trim();

    if (
      !trimmedName ||
      !trimmedSpecies ||
      !trimmedBreed ||
      !trimmedOwner ||
      !trimmedLastVisit
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const newPatient = {
      id: Date.now(),
      name: trimmedName,
      species: trimmedSpecies,
      breed: trimmedBreed,
      owner: trimmedOwner,
      lastVisit: trimmedLastVisit,
    };

    setPatients((prev) => [newPatient, ...prev]);
    closeAddModal();
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={pawLogo} alt="Logo" />
          <span>PawCruz</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-item" onClick={() => navigate("/vet")}>
            <img src={dashboardIcon} alt="" />
            <span>Dashboard</span>
          </div>

          <div
            className="nav-item active"
            onClick={() => navigate("/vet-patients")}
          >
            <img src={patientsIcon} alt="" />
            <span>Patients</span>
          </div>

          <div className="nav-item" onClick={() => navigate("/vet-calendar")}>
            <img src={appointmentIcon} alt="" />
            <span>Calendar</span>
          </div>

          <div className="nav-item" onClick={() => navigate("/vet-messages")}>
            <img src={messageIcon} alt="" />
            <span>Messages</span>
          </div>

          <div
            className="nav-item"
            onClick={() => navigate("/vet-medical-records")}
          >
            <img src={medicalIcon} alt="" />
            <span>Medical Records</span>
          </div>

          <div className="nav-item" onClick={() => navigate("/vet-inventory")}>
            <img src={inventoryIcon} alt="" />
            <span>Inventory</span>
          </div>
        </nav>
      </aside>

      <main className="main-area">
        <header className="top-bar">
          <div>
            <h2>Patient Management</h2>
            <p className="top-subtitle">Manage and review pet patients</p>
          </div>

          <div className="top-bar-right">
            <button
              type="button"
              className="notif-btn"
              onClick={() => navigate("/vet-notifications")}
            >
              <img src={bellIcon} alt="" />
            </button>

            <button
              type="button"
              className="user-profile"
              onClick={() => navigate("/vet-profile")}
            >
              <img src={userIcon} alt="" />
            </button>
          </div>
        </header>

        <section className="content-body">
          <div className="patients-list-card">
            <div className="content-header-row">
              <div>
                <h3 className="section-title">Patient List</h3>
                <p className="section-subtitle">
                  Total Registered Patients: {patients.length}
                </p>
              </div>

              <button
                type="button"
                className="add-patient-btn"
                onClick={openAddModal}
              >
                + Add Patient
              </button>
            </div>

            <div className="table-wrapper">
              <table className="patients-table">
                <thead>
                  <tr>
                    <th>Pet Name</th>
                    <th>Species</th>
                    <th>Breed</th>
                    <th>Owner</th>
                    <th>Last Visit</th>
                  </tr>
                </thead>

                <tbody>
                  {patients.map((p) => (
                    <tr key={p.id}>
                      <td className="pet-name-cell">{p.name}</td>
                      <td>{p.species}</td>
                      <td>{p.breed}</td>
                      <td>{p.owner}</td>
                      <td>{p.lastVisit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {showAddModal && (
          <div className="modal-overlay" onClick={closeAddModal}>
            <div
              className="add-patient-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Add Patient</h3>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={closeAddModal}
                >
                  ×
                </button>
              </div>

              <form className="patient-form" onSubmit={handleAddPatient}>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="name">Pet Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter pet name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="species">Species</label>
                    <input
                      id="species"
                      name="species"
                      type="text"
                      value={formData.species}
                      onChange={handleInputChange}
                      placeholder="Dog, Cat, etc."
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="breed">Breed</label>
                    <input
                      id="breed"
                      name="breed"
                      type="text"
                      value={formData.breed}
                      onChange={handleInputChange}
                      placeholder="Enter breed"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="owner">Owner</label>
                    <input
                      id="owner"
                      name="owner"
                      type="text"
                      value={formData.owner}
                      onChange={handleInputChange}
                      placeholder="Enter owner name"
                    />
                  </div>

                  <div className="form-group form-group-full">
                    <label htmlFor="lastVisit">Last Visit</label>
                    <input
                      id="lastVisit"
                      name="lastVisit"
                      type="date"
                      value={formData.lastVisit}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={closeAddModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    Save Patient
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default VetPatients;