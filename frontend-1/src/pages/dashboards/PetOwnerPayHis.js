import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/PetOwnerPayHis.css";

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

const PetOwnerPayHis = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // Mock data for payments
  const [payments] = useState([
    { id: "TXN-1001", date: "Oct 12, 2025", pet: "Bella", service: "Vaccination", amount: "₱1,200.00", status: "Paid" },
    { id: "TXN-1002", date: "Oct 15, 2025", pet: "Max", service: "General Checkup", amount: "₱850.00", status: "Paid" },
    { id: "TXN-1003", date: "Oct 20, 2025", pet: "Bella", service: "Grooming", amount: "₱1,500.00", status: "Pending" }
  ]);

  useEffect(() => {
    if (!user || user.role !== "pet_owner") {
      navigate("/login");
    }
  }, [navigate, user]);

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={pawLogo} alt="Logo" />
          <span>PawCruz</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-item" onClick={() => navigate("/pet-owner")}>
            <img src={dashboardIcon} alt="" />
            <span>Dashboard</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/pet-owner-appointments")}>
            <img src={appointmentIcon} alt="" />
            <span>Appointment</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/pet-owner-pets")}>
            <img src={petsIcon} alt="" />
            <span>My Pets</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/pet-owner-messages")}>
            <img src={messageIcon} alt="" />
            <span>Messages</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/pet-owner-records")}>
            <img src={medicalIcon} alt="" />
            <span>Medical Records</span>
          </div>
          <div className="nav-item active" onClick={() => navigate("/pet-owner-payments")}>
            <img src={paymentIcon} alt="" />
            <span>Payment History</span>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-area">
        <header className="top-bar">
          <h2>Payment History</h2>
          <div className="top-bar-right">
            <button className="notif-btn" onClick={() => navigate("/pet-owner-notifications")}>
              <img src={bellIcon} alt="Notifications" />
            </button>
            <div className="user-profile" onClick={() => navigate("/pet-owner-profile")}>
              <img src={userIcon} alt="User" />
            </div>
          </div>
        </header>

        <section className="content-body">
            <div className="dashboard-welcome-card" style={{background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', overflowX: 'auto'}}>
              {payments.length > 0 ? (
                <table className="payment-table" style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
                  <thead>
                    <tr style={{borderBottom: '2px solid #f0f0f0'}}>
                      <th style={{padding: '12px', color: '#888', fontWeight: '600'}}>Date</th>
                      <th style={{padding: '12px', color: '#888', fontWeight: '600'}}>Pet</th>
                      <th style={{padding: '12px', color: '#888', fontWeight: '600'}}>Service</th>
                      <th style={{padding: '12px', color: '#888', fontWeight: '600'}}>Amount</th>
                      <th style={{padding: '12px', color: '#888', fontWeight: '600'}}>Status</th>
                      <th style={{padding: '12px', color: '#888', fontWeight: '600'}}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((pay) => (
                      <tr key={pay.id} style={{borderBottom: '1px solid #f9f9f9'}}>
                        <td style={{padding: '15px 12px', fontSize: '14px'}}>{pay.date}</td>
                        <td style={{padding: '15px 12px', fontSize: '14px'}}>{pay.pet}</td>
                        <td style={{padding: '15px 12px', fontSize: '14px'}}>{pay.service}</td>
                        <td style={{padding: '15px 12px', fontSize: '14px', fontWeight: '600'}}>{pay.amount}</td>
                        <td style={{padding: '15px 12px'}}>
                          <span className={`status-pill ${pay.status.toLowerCase()}`} style={{
                            padding: '4px 10px', 
                            borderRadius: '20px', 
                            fontSize: '12px', 
                            fontWeight: '500',
                            backgroundColor: pay.status === 'Paid' ? '#e6f4ea' : '#fff4e5',
                            color: pay.status === 'Paid' ? '#1e7e34' : '#b45309'
                          }}>
                            {pay.status}
                          </span>
                        </td>
                        <td style={{padding: '15px 12px'}}>
                          <button style={{background: 'none', border: 'none', color: '#438fb5', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline'}}>View Receipt</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{color: '#555', textAlign: 'center'}}>No transaction history available. Your receipts and invoices will be listed here after payment.</p>
              )}
            </div>
        </section>
      </main>
    </div>
  );
};

export default PetOwnerPayHis;