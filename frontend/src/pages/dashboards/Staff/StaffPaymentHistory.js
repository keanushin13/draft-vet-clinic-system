import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/StaffPaymentHistory.css";

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

const StaffPaymentHistory = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // Sample data for payments
  const [payments] = useState([
    { id: "TXN-001", owner: "Juan Dela Cruz", pet: "Bella", service: "Checkup & Vaccination", amount: "â‚±1,200.00", date: "Feb 01, 2026", method: "GCash", status: "Paid" },
    { id: "TXN-002", owner: "Maria Clara", pet: "Max", service: "Surgery", amount: "â‚±5,500.00", date: "Jan 30, 2026", method: "Cash", status: "Paid" },
    { id: "TXN-003", owner: "Pedro Penduko", pet: "Luna", service: "Grooming", amount: "â‚±800.00", date: "Jan 28, 2026", method: "Bank Transfer", status: "Pending" },
    { id: "TXN-004", owner: "Elena Gilbert", pet: "Cooper", service: "Medical Supplies", amount: "â‚±450.00", date: "Jan 25, 2026", method: "Cash", status: "Refunded" },
  ]);

  useEffect(() => {
    if (!user || user.role !== "staff") {
      navigate("/login");
    }
  }, [navigate, user]);

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={pawLogo} alt="Logo" />
          <span>PawCruz</span>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-item" onClick={() => navigate("/staff")}><img src={dashboardIcon} alt="" /><span>Dashboard</span></div>
          <div className="nav-item" onClick={() => navigate("/staff-appointments")}><img src={appointmentIcon} alt="" /><span>Appointment</span></div>
          <div className="nav-item" onClick={() => navigate("/staff-users")}><img src={userManagementIcon} alt="" /><span>User Management</span></div>
          <div className="nav-item" onClick={() => navigate("/staff-pets")}><img src={petsProfileIcon} alt="" /><span>Pets Profile</span></div>
          <div className="nav-item" onClick={() => navigate("/staff-messages")}><img src={messageIcon} alt="" /><span>Messages</span></div>
          <div className="nav-item" onClick={() => navigate("/staff-inventory")}><img src={inventoryIcon} alt="" /><span>Inventory</span></div>
          <div className="nav-item active" onClick={() => navigate("/staff-payments")}><img src={payHistoryIcon} alt="" /><span>Payment History</span></div>
          <div className="nav-item" onClick={() => navigate("/staff-activity")}><img src={activityLogIcon} alt="" /><span>Activity Log</span></div>
        </nav>
      </aside>

      <main className="main-area">
        <header className="top-bar">
          <h2>Payment History</h2>
          <div className="top-bar-right">
            <button className="notif-btn" onClick={() => navigate("/staff-notifications")}><img src={bellIcon} alt="Notif" /></button>
            <div className="user-profile" onClick={() => navigate("/staff-profile")}><img src={userIcon} alt="Profile" /></div>
          </div>
        </header>

        <section className="content-body">
          <div className="payment-summary-row">
            <div className="summary-card">
              <span>Total Revenue (Feb)</span>
              <h3>â‚±12,450.00</h3>
            </div>
            <div className="summary-card">
              <span>Pending Payments</span>
              <h3>â‚±1,800.00</h3>
            </div>
          </div>

          <div className="payment-table-card">
            <div className="table-header">
              <h3>Transaction Records</h3>
              <input type="text" placeholder="Search by Transaction ID or Owner..." className="payment-search" />
            </div>
            
            <table className="payment-table">
              <thead>
                <tr>
                  <th>Txn ID</th>
                  <th>Pet Owner</th>
                  <th>Service</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td className="txn-id">{p.id}</td>
                    <td>
                      <div className="owner-info">
                        <strong>{p.owner}</strong>
                        <span>{p.pet}</span>
                      </div>
                    </td>
                    <td>{p.service}</td>
                    <td className="amount-cell">{p.amount}</td>
                    <td>{p.date}</td>
                    <td>
                      <span className={`payment-status ${p.status.toLowerCase()}`}>
                        {p.status}
                      </span>
                    </td>
                    <td><button className="receipt-btn">Receipt</button></td>
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

export default StaffPaymentHistory;