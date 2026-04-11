import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/StaffActivityLog.css";

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

const StaffActivityLog = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // Sample data for the activity log
  const [activities] = useState([
    { id: 1, staff: "Mark Santos", action: "Registered New Pet", target: "Max (Golden Retriever)", time: "01/23/2025 | 10:30 AM", status: "Completed" },
    { id: 2, staff: "Bianca Gonzales", action: "Booked Appointment", target: "Luna (Siamese)", time: "01/23/2025 | 09:15 AM", status: "Pending" },
    { id: 3, staff: "Mark Santos", action: "Inventory Update", target: "Amoxicillin (+50 units)", time: "01/22/2025 | 04:45 PM", status: "Completed" },
    { id: 4, staff: "Bianca Gonzales", action: "Payment Processed", target: "Transaction #8821", time: "01/22/2025 | 02:00 PM", status: "Completed" },
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
          <div className="nav-item" onClick={() => navigate("/staff")}>
            <img src={dashboardIcon} alt="" />
            <span>Dashboard</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/staff-appointments")}>
            <img src={appointmentIcon} alt="" />
            <span>Appointment</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/staff-users")}>
            <img src={userManagementIcon} alt="" />
            <span>User Management</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/staff-pets")}>
            <img src={petsProfileIcon} alt="" />
            <span>Pets Profile</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/staff-messages")}>
            <img src={messageIcon} alt="" />
            <span>Messages</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/staff-inventory")}>
            <img src={inventoryIcon} alt="" />
            <span>Inventory</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/staff-payments")}>
            <img src={payHistoryIcon} alt="" />
            <span>Payment History</span>
          </div>
          <div className="nav-item active" onClick={() => navigate("/staff-activity")}>
            <img src={activityLogIcon} alt="" />
            <span>Activity Log</span>
          </div>
        </nav>
      </aside>

      <main className="main-area">
        <header className="top-bar">
          <h2>Activity Log</h2>
          <div className="top-bar-right">
            {/* Added navigation click handler here */}
            <button className="notif-btn" onClick={() => navigate("/staff-notifications")}>
              <img src={bellIcon} alt="Notif" />
            </button>
            <div className="user-profile" onClick={() => navigate("/staff-profile")}>
              <img src={userIcon} alt="Profile" />
            </div>
          </div>
        </header>

        <section className="content-body">
          <div className="activity-container">
            <div className="log-header-flex">
               <h3>Recent Operations</h3>
               <div className="filter-search">
                  <input type="text" placeholder="Search activity..." className="log-search" />
               </div>
            </div>

            <div className="log-table-card">
              <table className="activity-table">
                <thead>
                  <tr>
                    <th>Staff Name</th>
                    <th>Action performed</th>
                    <th>Target Details</th>
                    <th>Timestamp</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((log) => (
                    <tr key={log.id}>
                      <td className="staff-cell">
                        <div className="staff-avatar">{log.staff.charAt(0)}</div>
                        {log.staff}
                      </td>
                      <td className="action-text">{log.action}</td>
                      <td>{log.target}</td>
                      <td className="time-text">{log.time}</td>
                      <td>
                        <span className={`status-pill ${log.status.toLowerCase()}`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StaffActivityLog;