import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/StaffActivityLog.css";
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

const StaffActivityLog = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { isOpen, toggle, close } = useSidebar();

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
            <StaffSidebar isOpen={isOpen} onClose={close} />

      <main className="main-area">
        <header className="top-bar">
          <button className="hamburger-btn" onClick={toggle} aria-label="Toggle menu"><span /><span /><span /></button>
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