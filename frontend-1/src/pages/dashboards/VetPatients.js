import { useEffect, useState } from "react";
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
  const user = JSON.parse(localStorage.getItem("user"));

  // Dummy data for the patient list
  const [patients] = useState([
    { id: 1, name: "Max", species: "Dog", breed: "Golden Retriever", owner: "Juan Dela Cruz", lastVisit: "2026-02-01" },
    { id: 2, name: "Luna", species: "Cat", breed: "Siamese", owner: "Maria Santos", lastVisit: "2026-01-28" },
    { id: 3, name: "Cooper", species: "Dog", breed: "Beagle", owner: "Ricardo Ramos", lastVisit: "2026-02-03" },
    { id: 4, name: "Bella", species: "Dog", breed: "Poodle", owner: "Elena Gomez", lastVisit: "2026-01-15" },
  ]);

  // FUNCTION: Guard Clause (Matches your PetOwner format)
  useEffect(() => {
    if (!user || user.role !== "veterinarian") {
      navigate("/login");
    }
  }, [navigate, user]);

  return (
    <div className="dashboard-container">
      {/* SIDEBAR - Patients is Active */}
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
          
          <div className="nav-item active" onClick={() => navigate("/vet-patients")}>
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

          <div className="nav-item" onClick={() => navigate("/vet-medical-records")}>
            <img src={medicalIcon} alt="" />
            <span>Medical Records</span>
          </div>

          <div className="nav-item" onClick={() => navigate("/vet-inventory")}>
            <img src={inventoryIcon} alt="" />
            <span>Inventory</span>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-area">
        <header className="top-bar">
          <h2>Patient Management</h2>
          <div className="top-bar-right">
            <button className="notif-btn" onClick={() => navigate("/vet-notifications")}>
              <img src={bellIcon} alt="Notifications" />
            </button>
            <div className="user-profile" onClick={() => navigate("/vet-profile")}>
              <img src={userIcon} alt="User" />
            </div>
          </div>
        </header>

        <section className="content-body">
            <div className="patients-list-card">
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
                      <td style={{fontWeight: '600', color: '#255065'}}>{p.name}</td>
                      <td>{p.species}</td>
                      <td>{p.breed}</td>
                      <td>{p.owner}</td>
                      <td>{p.lastVisit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </section>
      </main>
    </div>
  );
};

export default VetPatients;