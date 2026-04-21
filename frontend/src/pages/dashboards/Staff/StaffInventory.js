import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/StaffInventory.css";
import StaffSidebar from "../../../components/StaffSidebar";
import { useSidebar } from "../../../components/useSidebar";
import { getInventory, updateStock } from "../../../api/api";

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

  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!user || user.role !== "staff") {
      navigate("/login");
      return;
    }
    loadInventory();
  }, [navigate, user]);

  const loadInventory = () =>
    getInventory()
      .then((r) => setItems(r.data))
      .catch(() => {});

  const handleUpdateStock = async (item) => {
    const val = prompt(`Enter new stock for ${item.name}:`, item.stock);
    if (val === null || isNaN(val)) return;
    await updateStock(item.id, { stock: parseInt(val) });
    loadInventory();
  };

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
          <h2>Inventory Management</h2>
          <div className="top-bar-right">
            {/* Added the missing navigation handler here */}
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
                    <td>
                      <span className="cat-badge">{item.category}</span>
                    </td>
                    <td>
                      {item.stock} {item.unit}
                    </td>
                    <td>
                      <span
                        className={`stock-status ${item.status?.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="stock-btn"
                        onClick={() => handleUpdateStock(item)}
                      >
                        Update Stock
                      </button>
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
