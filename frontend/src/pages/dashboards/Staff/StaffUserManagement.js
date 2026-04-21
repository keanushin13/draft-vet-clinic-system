import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/StaffUserManagement.css";
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

const StaffUserManagement = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { isOpen, toggle, close } = useSidebar();

  // Sample data for users/pet owners
  const [users] = useState([
    { id: 1, name: "Juan Dela Cruz", email: "juan@example.com", phone: "09123456789", pets: 2, status: "Active" },
    { id: 2, name: "Maria Clara", email: "maria@example.com", phone: "09987654321", pets: 1, status: "Active" },
    { id: 3, name: "Pedro Penduko", email: "pedro@example.com", phone: "09112233445", pets: 1, status: "Suspended" },
    { id: 4, name: "Elena Gilbert", email: "elena@example.com", phone: "09556677889", pets: 3, status: "Active" },
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
          <h2>User Management</h2>
          <div className="top-bar-right">
            <button className="notif-btn" onClick={() => navigate("/staff-notifications")}><img src={bellIcon} alt="Notif" /></button>
            <div className="user-profile" onClick={() => navigate("/staff-profile")}><img src={userIcon} alt="Profile" /></div>
          </div>
        </header>

        <section className="content-body">
          <div className="user-mgmt-header">
            <div className="search-box">
              <input type="text" placeholder="Search by name or email..." className="user-search" />
            </div>
            <button className="add-user-btn">+ Add New Client</button>
          </div>

          <div className="user-table-card">
            <table className="user-table">
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Contact Info</th>
                  <th>Registered Pets</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="user-info-cell">
                        <div className="user-mini-avatar">{u.name.charAt(0)}</div>
                        <strong>{u.name}</strong>
                      </div>
                    </td>
                    <td>
                      <div className="contact-info-cell">
                        <span>{u.email}</span>
                        <small>{u.phone}</small>
                      </div>
                    </td>
                    <td>{u.pets} Pet(s)</td>
                    <td>
                      <span className={`user-status ${u.status.toLowerCase()}`}>
                        {u.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-view">View</button>
                        <button className="btn-edit">Edit</button>
                      </div>
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

export default StaffUserManagement;