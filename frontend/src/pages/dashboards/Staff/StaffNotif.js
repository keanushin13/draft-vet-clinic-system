import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/StaffNotif.css";

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
import userIcon from "../../../assets/User_Icon.png";
import userManagementIcon from "../../../assets/UserManagement_Icon.png";

const StaffNotif = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [notifications] = useState([
    { id: 1, type: 'appointment', title: 'New Appointment Request', message: 'Juan Dela Cruz requested a checkup for Bella.', time: '5 mins ago', read: false },
    { id: 2, type: 'inventory', title: 'Low Stock Alert', message: 'Rabies Vaccine is running low (8 units remaining).', time: '1 hour ago', read: false },
    { id: 3, type: 'message', title: 'New Message', message: 'Maria Clara sent a message regarding her pet Max.', time: '3 hours ago', read: true },
    { id: 4, type: 'system', title: 'Account Security', message: 'Your password was successfully updated.', time: 'Yesterday', read: true },
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
          <div className="nav-item" onClick={() => navigate("/staff-payments")}><img src={payHistoryIcon} alt="" /><span>Payment History</span></div>
          <div className="nav-item" onClick={() => navigate("/staff-activity")}><img src={activityLogIcon} alt="" /><span>Activity Log</span></div>
        </nav>
      </aside>

      <main className="main-area">
        <header className="top-bar">
          <h2>Notifications</h2>
          <div className="top-bar-right">
            <button className="notif-btn active"><img src={bellIcon} alt="Notif" /></button>
            <div className="user-profile" onClick={() => navigate("/staff-profile")}><img src={userIcon} alt="Profile" /></div>
          </div>
        </header>

        <section className="content-body">
          <div className="notif-wrapper">
            <div className="notif-header-actions">
               <h3>Recent Notifications</h3>
               <button className="mark-read-btn">Mark all as read</button>
            </div>

            <div className="notif-list">
              {notifications.map((n) => (
                <div key={n.id} className={`notif-card ${n.read ? 'read' : 'unread'}`}>
                  <div className={`notif-icon-circle ${n.type}`}>
                    {n.type === 'appointment' && <img src={appointmentIcon} alt="" />}
                    {n.type === 'inventory' && <img src={inventoryIcon} alt="" />}
                    {n.type === 'message' && <img src={messageIcon} alt="" />}
                    {n.type === 'system' && <img src={userIcon} alt="" />}
                  </div>
                  <div className="notif-content">
                    <div className="notif-title-row">
                      <h4>{n.title}</h4>
                      <span>{n.time}</span>
                    </div>
                    <p>{n.message}</p>
                  </div>
                  {!n.read && <div className="unread-dot"></div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StaffNotif;