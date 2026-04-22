import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/VetPatients.css";
import VetSidebar from "../../../components/VetSidebar";
import { useSidebar } from "../../../components/useSidebar";
import { getPets } from "../../../api/api";

// ASSETS
import appointmentIcon from "../../../assets/Appointment_Icon.png";
import bellIcon from "../../../assets/Bell_Icon.png";
import dashboardIcon from "../../../assets/Dashboard_Icon.png";
import medicalIcon from "../../../assets/Medical_Icon.png";
import messageIcon from "../../../assets/Message_Icon.png";
import pawLogo from "../../../assets/paw.png";
import inventoryIcon from "../../../assets/payment_icon.png";
import patientsIcon from "../../../assets/Pets_Icon.png";
import userIcon from "../../../assets/Profile.png";

const VetPatients = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { isOpen, toggle, close } = useSidebar();

  const [patients, setPatients] = useState([]);

  // FUNCTION: Guard Clause (Matches your PetOwner format)
  useEffect(() => {
    if (!user || user.role !== "veterinarian") {
      navigate("/login");
      return;
    }
    getPets()
      .then((r) => setPatients(r.data))
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <div
              className="user-profile"
              onClick={() => navigate("/vet-profile")}
            >
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
                    <td style={{ fontWeight: "600", color: "#255065" }}>
                      {p.name}
                    </td>
                    <td>{p.species}</td>
                    <td>{p.breed}</td>
                    <td>
                      {p.owner
                        ? `${p.owner.firstName ?? ""} ${p.owner.lastName ?? ""}`.trim() ||
                          p.owner.username
                        : "—"}
                    </td>
                    <td>
                      {p.updatedAt
                        ? new Date(p.updatedAt).toLocaleDateString()
                        : "—"}
                    </td>
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
