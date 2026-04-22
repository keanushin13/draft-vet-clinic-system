import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/PetOwnerMyPets.css";
import PetOwnerSidebar from "../../../components/PetOwnerSidebar";
import { useSidebar } from "../../../components/useSidebar";
import { getPets, createPet } from "../../../api/api";

// ASSETS
import appointmentIcon from "../../../assets/Appointment_Icon.png";
import bellIcon from "../../../assets/Bell_Icon.png";
import dashboardIcon from "../../../assets/Dashboard_Icon.png";
import medicalIcon from "../../../assets/Medical_Icon.png";
import messageIcon from "../../../assets/Message_Icon.png";
import pawLogo from "../../../assets/paw.png";
import paymentIcon from "../../../assets/payment_icon.png";
import petsIcon from "../../../assets/Pets_Icon.png";
import userIcon from "../../../assets/Profile.png";

const PetOwnerMyPets = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { isOpen, toggle, close } = useSidebar();

  const [pets, setPets] = useState([]);

  useEffect(() => {
    if (!user || user.role !== "pet_owner") {
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
          <h2>My Pets</h2>
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
            className="pets-header-action"
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
            >
              + Add New Pet
            </button>
          </div>

          {pets.length === 0 ? (
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
                You haven't registered any pets yet. Let's add one to get
                started!
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
                  <div
                    style={{
                      fontSize: "2rem",
                      textAlign: "center",
                      marginBottom: "8px",
                    }}
                  >
                    {pet.species === "Dog"
                      ? "??"
                      : pet.species === "Cat"
                        ? "??"
                        : "??"}
                  </div>
                  <h4
                    style={{
                      textAlign: "center",
                      color: "#255065",
                      margin: "0 0 4px",
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
                    {pet.breed} • {pet.age} yr(s)
                  </p>
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: "0.8rem",
                      marginTop: "4px",
                    }}
                  >
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: "20px",
                        background: "#dcfce7",
                        color: "#166534",
                      }}
                    >
                      {pet.status}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default PetOwnerMyPets;
