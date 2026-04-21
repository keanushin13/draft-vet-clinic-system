import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/StaffActivityLog.css";
import StaffSidebar from "../../../components/StaffSidebar";
import { useSidebar } from "../../../components/useSidebar";
import { getActivityLogs } from "../../../api/api";

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

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (!user || user.role !== "staff") {
      navigate("/login");
      return;
    }
    getActivityLogs()
      .then((r) => setActivities(r.data))
      .catch(() => {});
  }, [navigate, user]);

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
          <h2>Activity Log</h2>
          <div className="top-bar-right">
            {/* Added navigation click handler here */}
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
          <div className="activity-container">
            <div className="log-header-flex">
              <h3>Recent Operations</h3>
              <div className="filter-search">
                <input
                  type="text"
                  placeholder="Search activity..."
                  className="log-search"
                />
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
                        <div className="staff-avatar">
                          {(
                            log.staff?.firstName ||
                            log.staff?.username ||
                            "?"
                          ).charAt(0)}
                        </div>
                        {log.staff?.firstName
                          ? `${log.staff.firstName} ${log.staff.lastName}`
                          : log.staff?.username}
                      </td>
                      <td className="action-text">{log.action}</td>
                      <td>{log.target}</td>
                      <td className="time-text">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td>
                        <span
                          className={`status-pill ${log.status?.toLowerCase()}`}
                        >
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
