import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/StaffPetsProfile.css";
import StaffSidebar from "../../../components/StaffSidebar";
import { useSidebar } from "../../../components/useSidebar";
import { getPets } from "../../../api/api";

// ASSETS
import appointmentIcon from "../../../assets/Appointment_Icon.png";
import bellIcon from "../../../assets/Bell_Icon.png";
import dashboardIcon from "../../../assets/Dashboard_Icon.png";
import inventoryIcon from "../../../assets/Inventory_Icon.png";
import activityLogIcon from "../../../assets/Medical_Icon.png";
import messageIcon from "../../../assets/Message_Icon.png";
import pawLogo from "../../../assets/paw.png";
import payHistoryIcon from "../../../assets/payment_icon.png";
import petsProfileIcon from "../../../assets/Pets_Icon.png";
import userIcon from "../../../assets/Profile.png";
import userManagementIcon from "../../../assets/UserManagement_Icon.png";

const StaffPetsProfile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { isOpen, toggle, close } = useSidebar();

  const [pets, setPets] = useState([]);

  useEffect(() => {
    if (!user || user.role !== "staff") {
      navigate("/login");
      return;
    }
    getPets()
      .then((r) => setPets(r.data))
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <h2>Pets Profile</h2>
          <div className="top-bar-right">
            <button
              className="notif-btn"
              onClick={() => navigate("/staff-notifications")}
            >
              <img src={bellIcon} alt="Notif" />
            </button>
            <div
              className="user-profile"
              onClick={() => navigate("/staff-profile")}
            >
              <img src={userIcon} alt="Profile" />
            </div>
          </div>
        </header>

        <section className="content-body">
          <div className="pets-mgmt-header">
            <div className="pet-search-bar">
              <input
                type="text"
                placeholder="Search by pet name, breed, or owner..."
              />
            </div>
            <button className="add-pet-btn">+ Register Pet</button>
          </div>

          <div className="pets-grid">
            {pets.map((pet) => (
              <div key={pet.id} className="pet-card">
                <div className="pet-card-top">
                  <div className="pet-avatar-placeholder">
                    {pet.name.charAt(0)}
                  </div>
                  <div className="pet-title-info">
                    <h3>{pet.name}</h3>
                    <span>{pet.breed}</span>
                  </div>
                  <span
                    className={`pet-status-tag ${pet.status?.toLowerCase().replace(/ /g, "-")}`}
                  >
                    {pet.status}
                  </span>
                </div>

                <div className="pet-card-body">
                  <div className="pet-info-row">
                    <label>Owner:</label>
                    <p>
                      {pet.owner
                        ? `${pet.owner.firstName ?? ""} ${pet.owner.lastName ?? ""}`.trim() ||
                          pet.owner.username
                        : "—"}
                    </p>
                  </div>
                  <div className="pet-info-row">
                    <label>Gender / Age:</label>
                    <p>
                      {pet.gender}, {pet.age} yr(s)
                    </p>
                  </div>
                </div>

                <div className="pet-card-footer">
                  <button className="btn-view-records">Medical Records</button>
                  <button className="btn-edit-pet">Edit</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default StaffPetsProfile;
