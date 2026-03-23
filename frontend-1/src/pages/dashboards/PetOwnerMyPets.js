import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/PetOwnerMyPets.css";

// ASSETS
import appointmentIcon from "../../assets/Appointment_Icon.png";
import bellIcon from "../../assets/Bell_Icon.png";
import dashboardIcon from "../../assets/Dashboard_Icon.png";
import medicalIcon from "../../assets/Medical_Icon.png";
import messageIcon from "../../assets/Message_Icon.png";
import pawLogo from "../../assets/paw.png";
import paymentIcon from "../../assets/payment_icon.png";
import petsIcon from "../../assets/Pets_Icon.png";
import userIcon from "../../assets/User_Icon.png";

const defaultPets = [
  {
    id: "098787",
    name: "Bella",
    species: "Dog",
    breed: "Golden Retriever",
    age: "3 yrs",
    weight: "28kg",
    gender: "Female",
    photo: ""
  },
  {
    id: "098788",
    name: "Max",
    species: "Cat",
    breed: "Persian",
    age: "2 yrs",
    weight: "4.5kg",
    gender: "Male",
    photo: ""
  }
];

const PetOwnerMyPets = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const [pets, setPets] = useState(() => {
    const savedPets = localStorage.getItem("pets");
    return savedPets ? JSON.parse(savedPets) : defaultPets;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPetIndex, setSelectedPetIndex] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    species: "",
    breed: "",
    age: "",
    weight: "",
    gender: "",
    photo: ""
  });

  useEffect(() => {
    if (!user || user.role !== "pet_owner") {
      navigate("/login");
    }
  }, [navigate, user]);

  const savePetsToStorage = (updatedPets) => {
    localStorage.setItem("pets", JSON.stringify(updatedPets));
    setPets(updatedPets);
  };

  const openEditModal = (index) => {
    const pet = pets[index];
    setSelectedPetIndex(index);
    setFormData({
      id: pet.id || "",
      name: pet.name || "",
      species: pet.species || "",
      breed: pet.breed || "",
      age: pet.age || "",
      weight: pet.weight || "",
      gender: pet.gender || "",
      photo: pet.photo || ""
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPetIndex(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        photo: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setFormData((prev) => ({
      ...prev,
      photo: ""
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const saveEdit = () => {
    if (
      !formData.name.trim() ||
      !formData.species.trim() ||
      !formData.breed.trim() ||
      !formData.age.trim() ||
      !formData.weight.trim() ||
      !formData.gender.trim()
    ) {
      alert("Please complete all pet details before saving.");
      return;
    }

    const updatedPets = [...pets];
    updatedPets[selectedPetIndex] = {
      ...updatedPets[selectedPetIndex],
      ...formData
    };

    savePetsToStorage(updatedPets);
    closeModal();
  };

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={pawLogo} alt="Logo" className="nav-logo" />
          <span>PawCruz</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-item" onClick={() => navigate("/pet-owner")}>
            <img src={dashboardIcon} alt="" className="nav-icon" />
            <span>Dashboard</span>
          </div>
          <div
            className="nav-item"
            onClick={() => navigate("/pet-owner-appointments")}
          >
            <img src={appointmentIcon} alt="" className="nav-icon" />
            <span>Appointment</span>
          </div>
          <div className="nav-item active">
            <img src={petsIcon} alt="" className="nav-icon" />
            <span>My Pets</span>
          </div>
          <div
            className="nav-item"
            onClick={() => navigate("/pet-owner-messages")}
          >
            <img src={messageIcon} alt="" className="nav-icon" />
            <span>Messages</span>
          </div>
          <div
            className="nav-item"
            onClick={() => navigate("/pet-owner-records")}
          >
            <img src={medicalIcon} alt="" className="nav-icon" />
            <span>Medical Records</span>
          </div>
          <div
            className="nav-item"
            onClick={() => navigate("/pet-owner-payments")}
          >
            <img src={paymentIcon} alt="" className="nav-icon" />
            <span>Payment History</span>
          </div>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="main-area">
        <header className="top-bar">
          <h2>My Pets</h2>
          <div className="top-bar-right">
            <button
              className="notif-btn"
              onClick={() => navigate("/pet-owner-notifications")}
            >
              <img src={bellIcon} alt="Notifications" className="top-icon" />
            </button>
            <div
              className="user-profile"
              onClick={() => navigate("/pet-owner-profile")}
            >
              <img src={userIcon} alt="User" className="top-avatar" />
            </div>
          </div>
        </header>

        <section className="dashboard-scroll-body">
          <div className="pets-header-action">
            <h3 className="section-title">Manage Your Pets</h3>
          </div>

          <div className="pets-grid">
            {pets.length > 0 ? (
              pets.map((pet, index) => (
                <div key={pet.id} className="pet-card">
                  <div className="pet-card-header">
                    <div className="pet-avatar-large">
                      {pet.photo ? (
                        <img
                          src={pet.photo}
                          alt={pet.name}
                          className="pet-photo-preview"
                        />
                      ) : (
                        <img src={pawLogo} alt="pet" />
                      )}
                    </div>
                    <div className="pet-id-tag">#{pet.id}</div>
                  </div>

                  <div className="pet-card-body">
                    <h4>{pet.name}</h4>
                    <p className="pet-breed">
                      {pet.breed} • {pet.species}
                    </p>

                    <div className="pet-stats-row">
                      <div className="stat-item">
                        <span>Age</span>
                        <strong>{pet.age}</strong>
                      </div>
                      <div className="stat-item">
                        <span>Weight</span>
                        <strong>{pet.weight}</strong>
                      </div>
                      <div className="stat-item">
                        <span>Gender</span>
                        <strong>{pet.gender}</strong>
                      </div>
                    </div>

                    <div className="pet-card-actions">
                      <button
                        className="action-outline"
                        onClick={() => navigate("/pet-owner-records")}
                      >
                        <img src={medicalIcon} className="tiny-icon" alt="" />
                        History
                      </button>
                      <button
                        className="action-outline"
                        onClick={() => navigate("/pet-owner-appointments")}
                      >
                        <img
                          src={appointmentIcon}
                          className="tiny-icon"
                          alt=""
                        />
                        Book
                      </button>
                    </div>

                    <button
                      className="edit-pet-link"
                      onClick={() => openEditModal(index)}
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-pets-state">
                <img src={petsIcon} className="large-faded-icon" alt="" />
                <p>You haven't registered any pets yet. Let's add one to get started!</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {isModalOpen && (
        <div className="pet-modal">
          <div className="pet-modal-content">
            <h3>Edit Pet Profile</h3>

            <div className="edit-photo-section">
              <div className="edit-photo-wrapper" onClick={handlePhotoClick}>
                {formData.photo ? (
                  <img
                    src={formData.photo}
                    alt="Pet Preview"
                    className="edit-photo-preview"
                  />
                ) : (
                  <img
                    src={pawLogo}
                    alt="Default Pet"
                    className="edit-photo-preview"
                  />
                )}
                <div className="edit-photo-overlay">Change Photo</div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: "none" }}
              />

              <div className="photo-action-buttons">
                <button
                  type="button"
                  className="action-outline"
                  onClick={handlePhotoClick}
                >
                  Upload Photo
                </button>
                <button
                  type="button"
                  className="action-outline"
                  onClick={removePhoto}
                >
                  Remove Photo
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Pet Name</label>
              <input name="name" value={formData.name} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Species</label>
              <input name="species" value={formData.species} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Breed</label>
              <input name="breed" value={formData.breed} onChange={handleChange} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Age</label>
                <input name="age" value={formData.age} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Weight</label>
                <input name="weight" value={formData.weight} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="modal-action-row">
              <button className="add-pet-btn-rect" onClick={saveEdit}>Save</button>
              <button className="action-outline" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
              

export default PetOwnerMyPets;