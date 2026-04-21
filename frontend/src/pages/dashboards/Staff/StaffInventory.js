import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/StaffInventory.css";
import StaffSidebar from "../../../components/StaffSidebar";
import { useSidebar } from "../../../components/useSidebar";

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

const StaffInventory = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { isOpen, toggle, close } = useSidebar();

  // Sample data for inventory
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
            <StaffSidebar isOpen={isOpen} onClose={close} />

      <main className="main-area">
        <header className="top-bar">
          <button className="hamburger-btn" onClick={toggle} aria-label="Toggle menu"><span /><span /><span /></button>
          <h2>Inventory Management</h2>
          <div className="top-bar-right">
            {/* Added the missing navigation handler here */}
            <button className="notif-btn" onClick={() => navigate("/staff-notifications")}>
              <img src={bellIcon} alt="Notif" />
            </button>
            <div className="user-profile" onClick={() => navigate("/staff-profile")}>
              <img src={userIcon} alt="Profile" />
            </div>
          </div>
        </header>

        <section className="content-body">
          <div className="inventory-header">
            <div className="inventory-stats">
              <div className="stat-box">
                <span className="stat-label">Total Items</span>
                <span className="stat-num">152</span>
              </div>
              <div className="stat-box warning">
                <span className="stat-label">Low Stock</span>
                <span className="stat-num">12</span>
              </div>
            </div>
            <button className="add-item-btn">+ Add New Item</button>
          </div>

          <div className="inventory-card">
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
                    <td className="item-name-cell">{item.name}</td>
                    <td><span className="cat-badge">{item.category}</span></td>
                    <td>{item.stock} {item.unit}</td>
                    <td>
                      <span className={`stock-status ${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <button className="stock-btn">Update Stock</button>
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