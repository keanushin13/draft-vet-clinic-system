import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../css/PetOwnerPayHis.css";

// ASSETS
import appointmentIcon from "../../assets/Appointment_Icon.png";
import bellIcon from "../../assets/Bell_Icon.png";
import dashboardIcon from "../../assets/Dashboard_Icon.png";
import medicalIcon from "../../assets/Medical_Icon.png";
import messageIcon from "../../assets/Message_Icon.png";
import pawLogo from "../../assets/paw.png";
import paymentIcon from "../../assets/payment_icon.png";
import petsIcon from "../../assets/Pets_Icon.png";
import userIcon from "../../assets/User_Icon.png";

const PetOwnerPayHis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const [payments, setPayments] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 5;

  // ✅ SIDEBAR MENU (REUSABLE)
  const menuItems = [
    { path: "/pet-owner", label: "Dashboard", icon: dashboardIcon },
    { path: "/pet-owner-appointments", label: "Appointment", icon: appointmentIcon },
    { path: "/pet-owner-pets", label: "My Pets", icon: petsIcon },
    { path: "/pet-owner-messages", label: "Messages", icon: messageIcon },
    { path: "/pet-owner-records", label: "Medical Records", icon: medicalIcon },
    { path: "/pet-owner-payments", label: "Payment History", icon: paymentIcon },
  ];

  // ✅ SAFE NAVIGATION (PREVENT REDUNDANT CLICK)
  const handleNavigate = (path) => {
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user")) || null;

  if (!storedUser || storedUser.role !== "pet_owner") {
    navigate("/login");
    return;
  }

  const appointments =
    JSON.parse(localStorage.getItem("petOwnerAppointments")) || [];

  const converted = appointments.map((apt) => ({
    id: "TXN-" + apt.id,
    date: `Sep ${apt.day}, 2025`,
    pet: apt.petName,
    service: apt.reason,
    amount: "₱500.00",
    status: apt.status === "confirmed" ? "Paid" : "Pending",
    method: apt.paymentMethod || "N/A",
    reference: apt.paymentReference || "N/A",
    vet: apt.vet || "N/A",
    time: apt.time || "N/A",
  }));

  setPayments(converted);
}, [navigate]);

  const filteredPayments = useMemo(() => {
    return payments.filter(
      (payment) =>
        payment.pet.toLowerCase().includes(search.toLowerCase()) ||
        payment.service.toLowerCase().includes(search.toLowerCase()) ||
        payment.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [payments, search]);

  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / rowsPerPage));
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={pawLogo} alt="Logo" className="nav-logo" />
          <span>PawCruz</span>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <div
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => handleNavigate(item.path)}
            >
              <img src={item.icon} alt={item.label} className="nav-icon" />
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
      </aside>

      {/* MAIN */}
      <main className="main-area">
        <header className="top-bar">
          <h2>Payment History</h2>

          <div className="top-bar-right">
            <button
              className="notif-btn"
              onClick={() => navigate("/pet-owner-notifications")}
            >
              <img src={bellIcon} alt="Notifications" className="top-icon" />
            </button>

            <div
              className="user-profile"
              onClick={() => navigate("/pet-owner-profile")}
            >
              <img src={userIcon} alt="User" className="top-avatar" />
            </div>
          </div>
        </header>

        <section className="content-body">
          <div className="dashboard-welcome-card">
            {payments.length > 0 ? (
              <>
                <input
                  type="text"
                  placeholder="Search by transaction ID, pet, or service..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-input"
                />

                <table className="payment-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Pet</th>
                      <th>Service</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentPayments.map((pay) => (
                      <tr
                        key={pay.id}
                        className="clickable-row"
                        onClick={() => setSelectedReceipt(pay)}
                      >
                        <td>{pay.date}</td>
                        <td>{pay.pet}</td>
                        <td>{pay.service}</td>
                        <td>{pay.amount}</td>

                        <td>
                          <span className={`status-pill ${pay.status.toLowerCase()}`}>
                            {pay.status}
                          </span>
                        </td>

                        <td>
                          <button
                            className="view-receipt-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedReceipt(pay);
                            }}
                          >
                            View Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="pagination">
                  <button
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    disabled={currentPage === 1}
                  >
                    Prev
                  </button>

                  <span>
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <p>No payment history yet.</p>
            )}
          </div>
        </section>
      </main>

      {/* RECEIPT MODAL */}
      {selectedReceipt && (
        <div className="pet-modal" onClick={() => setSelectedReceipt(null)}>
          <div
            className="pet-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Payment Receipt</h3>

            <div className="form-group">
              <label>Transaction ID</label>
              <p>{selectedReceipt.id}</p>
            </div>

            <div className="form-group">
              <label>Pet</label>
              <p>{selectedReceipt.pet}</p>
            </div>

            <div className="form-group">
              <label>Service</label>
              <p>{selectedReceipt.service}</p>
            </div>

            <div className="form-group">
              <label>Date & Time</label>
              <p>{selectedReceipt.date} - {selectedReceipt.time}</p>
            </div>

            <div className="form-group">
              <label>Veterinarian</label>
              <p>{selectedReceipt.vet}</p>
            </div>

            <div className="form-group">
              <label>Payment Method</label>
              <p>{selectedReceipt.method}</p>
            </div>

            <div className="form-group">
              <label>Reference</label>
              <p>{selectedReceipt.reference}</p>
            </div>

            <div className="form-group">
              <label>Amount</label>
              <p>{selectedReceipt.amount}</p>
            </div>

            <div className="modal-action-row">
              <button
                className="add-pet-btn-rect"
                onClick={() => setSelectedReceipt(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetOwnerPayHis;