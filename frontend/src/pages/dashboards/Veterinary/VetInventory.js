import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/VetInventory.css";

// ASSETS
import appointmentIcon from "../../../assets/Appointment_Icon.png";
import bellIcon from "../../../assets/Bell_Icon.png";
import dashboardIcon from "../../../assets/Dashboard_Icon.png";
import medicalIcon from "../../../assets/Medical_Icon.png";
import messageIcon from "../../../assets/Message_Icon.png";
import pawLogo from "../../../assets/paw.png";
import inventoryIcon from "../../../assets/payment_icon.png";
import patientsIcon from "../../../assets/Pets_Icon.png";
import userIcon from "../../../assets/User_Icon.png";

const VetInventory = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // Dummy data for clinic supplies
  const [items] = useState([
    { id: 1, name: "Rabies Vaccine", category: "Biologics", stock: 24, status: "In Stock" },
    { id: 2, name: "Amoxicillin 250mg", category: "Medicine", stock: 5, status: "Low Stock" },
    { id: 3, name: "Surgical Gloves (M)", category: "Supplies", stock: 150, status: "In Stock" },
    { id: 4, name: "Microchips", category: "Hardware", stock: 0, status: "Out of Stock" },
  ]);

  // FUNCTION: Guard Clause (Matches your PetOwner format)
  useEffect(() => {
    if (!user || user.role !== "veterinarian") {
      navigate("/login");
    }
  }, [navigate, user]);

  return (
    <div className="dashboard-container">
      {/* SIDEBAR - Inventory is now active */}
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

          <div className="nav-item" onClick={() => navigate("/vet-medical-records")}>
            <img src={medicalIcon} alt="" />
            <span>Medical Records</span>
          </div>

          <div className="nav-item active" onClick={() => navigate("/vet-inventory")}>
            <img src={inventoryIcon} alt="" />
            <span>Inventory</span>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-area">
        <header className="top-bar">
          <h2>Clinic Inventory</h2>
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
            <div className="dashboard-header-action">
                <h3 style={{fontFamily: 'Poppins', fontWeight: '600', marginBottom: '15px'}}>Supply Management</h3>
                <p style={{color: '#555', marginBottom: '25px'}}>Monitor and manage your medical supplies and pharmaceutical stock.</p>
            </div>
            
            <div className="inventory-card" style={{background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)'}}>
              <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
                <thead>
                  <tr style={{borderBottom: '2px solid #f0f0f0'}}>
                    <th style={{padding: '15px', color: '#255065'}}>Item Name</th>
                    <th style={{padding: '15px', color: '#255065'}}>Category</th>
                    <th style={{padding: '15px', color: '#255065'}}>Stock Level</th>
                    <th style={{padding: '15px', color: '#255065'}}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} style={{borderBottom: '1px solid #f9f9f9'}}>
                      <td style={{padding: '15px', fontWeight: '500'}}>{item.name}</td>
                      <td style={{padding: '15px'}}>{item.category}</td>
                      <td style={{padding: '15px'}}>{item.stock} units</td>
                      <td style={{padding: '15px'}}>
                        <span style={{
                          padding: '5px 12px', 
                          borderRadius: '20px', 
                          fontSize: '12px',
                          backgroundColor: item.status === 'In Stock' ? '#dcfce7' : item.status === 'Low Stock' ? '#fef9c3' : '#fee2e2',
                          color: item.status === 'In Stock' ? '#166534' : item.status === 'Low Stock' ? '#854d0e' : '#991b1b'
                        }}>
                          {item.status}
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

export default VetInventory;