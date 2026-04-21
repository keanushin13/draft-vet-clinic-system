import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/StaffPaymentHistory.css";
import StaffSidebar from "../../../components/StaffSidebar";
import { useSidebar } from "../../../components/useSidebar";
import { getPayments } from "../../../api/api";

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
  const { isOpen, toggle, close } = useSidebar();

  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (!user || user.role !== "staff") {
      navigate("/login");
      return;
    }
    getPayments()
      .then((r) => setPayments(r.data))
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
          <h2>Payment History</h2>
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
              <input
                type="text"
                placeholder="Search by Transaction ID or Owner..."
                className="payment-search"
              />
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
                    <td className="txn-id">
                      TXN-{String(p.id).padStart(3, "0")}
                    </td>
                    <td>
                      <div className="owner-info">
                        <strong>
                          {p.owner
                            ? `${p.owner.firstName ?? ""} ${p.owner.lastName ?? ""}`.trim() ||
                              p.owner.username
                            : "—"}
                        </strong>
                        <span>{p.pet?.name}</span>
                      </div>
                    </td>
                    <td>{p.service}</td>
                    <td className="amount-cell">
                      ₱{Number(p.amount).toLocaleString()}
                    </td>
                    <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span
                        className={`payment-status ${p.status?.toLowerCase()}`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <button className="receipt-btn">Receipt</button>
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

export default StaffPaymentHistory;
