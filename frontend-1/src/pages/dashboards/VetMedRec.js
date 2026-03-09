import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/VetMedRec.css";

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

const VetMedRec = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // Dummy data for medical records
  const [records] = useState([
    { id: "REC-001", patient: "Max", owner: "Juan Dela Cruz", date: "2026-02-01", diagnosis: "Annual Vaccination", status: "Finalized" },
    { id: "REC-002", patient: "Luna", owner: "Maria Santos", date: "2026-01-28", diagnosis: "Ear Infection", status: "Follow-up" },
    { id: "REC-003", patient: "Cooper", owner: "Ricardo Ramos", date: "2026-01-15", diagnosis: "Minor Scratches", status: "Finalized" },
  ]);

  useEffect(() => {
    if (!user || user.role !== "veterinarian") {
      navigate("/login");
    }
  }, [navigate, user]);

  return (
    <div className="dashboard-container">
      {/* SIDEBAR - Medical Records is Active */}
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
          
          <div className="nav-item" onClick={() => navigate("/vet-patients")}>
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

          <div className="nav-item active" onClick={() => navigate("/vet-medical-records")}>
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
          <h2>Clinical Medical Records</h2>
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
            <div className="records-list-card" style={{background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)'}}>
              <div className="records-filters" style={{marginBottom: '20px', display: 'flex', gap: '10px'}}>
                  <input type="text" placeholder="Search by Patient ID or Name..." style={{flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ddd'}} />
                  <button style={{backgroundColor: '#255065', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer'}}>New Entry</button>
              </div>

              <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
                <thead>
                  <tr style={{borderBottom: '2px solid #f0f0f0'}}>
                    <th style={{padding: '15px', color: '#63b6c5'}}>Record ID</th>
                    <th style={{padding: '15px', color: '#63b6c5'}}>Patient</th>
                    <th style={{padding: '15px', color: '#63b6c5'}}>Date</th>
                    <th style={{padding: '15px', color: '#63b6c5'}}>Diagnosis</th>
                    <th style={{padding: '15px', color: '#63b6c5'}}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((rec) => (
                    <tr key={rec.id} style={{borderBottom: '1px solid #f9f9f9', cursor: 'pointer'}} onClick={() => console.log("Open Record", rec.id)}>
                      <td style={{padding: '15px', fontWeight: '500', color: '#255065'}}>{rec.id}</td>
                      <td style={{padding: '15px'}}>{rec.patient} <br/><small style={{color: '#888'}}>{rec.owner}</small></td>
                      <td style={{padding: '15px'}}>{rec.date}</td>
                      <td style={{padding: '15px'}}>{rec.diagnosis}</td>
                      <td style={{padding: '15px'}}>
                         <span className={`status-pill ${rec.status.toLowerCase().replace('-', '')}`} style={{
                           padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '500',
                           backgroundColor: rec.status === 'Finalized' ? '#e0f2f1' : '#fff3e0',
                           color: rec.status === 'Finalized' ? '#00695c' : '#ef6c00'
                         }}>
                           {rec.status}
                         </span>
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

export default VetMedRec;