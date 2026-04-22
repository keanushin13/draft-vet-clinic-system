import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/StaffUserManagement.css";
import StaffSidebar from "../../../components/StaffSidebar";
import { useSidebar } from "../../../components/useSidebar";
import { getUsers } from "../../../api/api";

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

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user || user.role !== "staff") {
      navigate("/login");
      return;
    }
    getUsers({ role: "pet_owner" })
      .then((r) => setUsers(r.data))
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <h2>User Management</h2>
          <div className="top-bar-right">
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
          <div className="user-mgmt-header">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by name or email..."
                className="user-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
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
                {users
                  .filter((u) => {
                    const q = search.toLowerCase();
                    return (
                      !q ||
                      (u.firstName + " " + u.lastName)
                        .toLowerCase()
                        .includes(q) ||
                      u.email.toLowerCase().includes(q)
                    );
                  })
                  .map((u) => (
                    <tr key={u.id}>
                      <td>
                        <div className="user-info-cell">
                          <div className="user-mini-avatar">
                            {(u.firstName || u.username).charAt(0)}
                          </div>
                          <strong>
                            {u.firstName
                              ? `${u.firstName} ${u.lastName}`
                              : u.username}
                          </strong>
                        </div>
                      </td>
                      <td>
                        <div className="contact-info-cell">
                          <span>{u.email}</span>
                          <small>{u.phone || "—"}</small>
                        </div>
                      </td>
                      <td>{u._count?.petsOwned ?? 0} Pet(s)</td>
                      <td>
                        <span
                          className={`user-status ${u.isActive ? "active" : "suspended"}`}
                        >
                          {u.isActive ? "Active" : "Inactive"}
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
