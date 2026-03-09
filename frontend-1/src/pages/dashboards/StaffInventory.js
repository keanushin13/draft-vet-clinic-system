import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/StaffInventory.css";

// ASSETS
import appointmentIcon from "../../assets/Appointment_Icon.png";
import bellIcon from "../../assets/Bell_Icon.png";
import dashboardIcon from "../../assets/Dashboard_Icon.png";
import inventoryIcon from "../../assets/Inventory_Icon.png";
import activityLogIcon from "../../assets/Medical_Icon.png";
import messageIcon from "../../assets/Message_Icon.png";
import pawLogo from "../../assets/paw.png";
import payHistoryIcon from "../../assets/payment_icon.png";
import petsProfileIcon from "../../assets/Pets_Icon.png";
import userIcon from "../../assets/User_Icon.png";
import userManagementIcon from "../../assets/UserManagement_Icon.png";

const StaffInventory = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [items] = useState([
    { id: 1, name: "Amoxicillin 250mg", category: "Medication", stock: 45, unit: "Bottles", status: "In Stock" },
    { id: 2, name: "Rabies Vaccine", category: "Vaccine", stock: 8, unit: "Vials", status: "Low Stock" },
    { id: 3, name: "Surgical Gloves (M)", category: "Supplies", stock: 120, unit: "Pairs", status: "In Stock" },
    { id: 4, name: "Pet Shampoo 500ml", category: "Grooming", stock: 3, unit: "Units", status: "Low Stock" },
    { id: 5, name: "Microchips", category: "Medical", stock: 0, unit: "Units", status: "Out of Stock" },
  ]);

  useEffect(() => {
    if (!user || user.role !== "staff") {
      navigate("/login");
    }
  }, [navigate, user]);

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={pawLogo} alt="Logo" className="nav-logo" />
          <span>PawCruz</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-item" onClick={() => navigate("/staff")}><img src={dashboardIcon} className="nav-icon" alt="" /><span>Dashboard</span></div>
          <div className="nav-item" onClick={() => navigate("/staff-appointments")}><img src={appointmentIcon} className="nav-icon" alt="" /><span>Appointment</span></div>
          <div className="nav-item" onClick={() => navigate("/staff-users")}><img src={userManagementIcon} className="nav-icon" alt="" /><span>User Management</span></div>
          <div className="nav-item" onClick={() => navigate("/staff-pets")}><img src={petsProfileIcon} className="nav-icon" alt="" /><span>Pets Profile</span></div>
          <div className="nav-item" onClick={() => navigate("/staff-messages")}><img src={messageIcon} className="nav-icon" alt="" /><span>Messages</span></div>
          <div className="nav-item active" onClick={() => navigate("/staff-inventory")}><img src={inventoryIcon} className="nav-icon" alt="" /><span>Inventory</span></div>
          <div className="nav-item" onClick={() => navigate("/staff-payments")}><img src={payHistoryIcon} className="nav-icon" alt="" /><span>Payment History</span></div>
          <div className="nav-item" onClick={() => navigate("/staff-activity")}><img src={activityLogIcon} className="nav-icon" alt="" /><span>Activity Log</span></div>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="main-area">
        <header className="top-bar">
          <h2>Inventory Management</h2>
          <div className="top-bar-right">
            <button className="notif-btn" onClick={() => navigate("/staff-notifications")}>
              <img src={bellIcon} alt="Notif" className="top-icon" />
            </button>
            <div className="user-profile" onClick={() => navigate("/staff-profile")}>
              <img src={userIcon} alt="Profile" className="top-avatar" />
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <section className="dashboard-scroll-body">
          <div className="inventory-summary-row">
            <div className="inv-stats-flex">
              <div className="stat-pill">
                <span className="pill-label">Total Items</span>
                <span className="pill-val">152</span>
              </div>
              <div className="stat-pill warn">
                <span className="pill-label">Low Stock</span>
                <span className="pill-val">12</span>
              </div>
            </div>
            <button className="add-item-btn-rect">Add New Item</button>
          </div>

          <div className="inventory-table-container">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="item-name-bold">{item.name}</td>
                    <td><span className="category-tag">{item.category}</span></td>
                    <td>{item.stock} <small>{item.unit}</small></td>
                    <td>
                      <span className={`status-box ${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn-update">Update</button>
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

export default StaffInventory;