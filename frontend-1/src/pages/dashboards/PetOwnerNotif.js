import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/PetOwnerNotif.css";

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

const PetOwnerNotif = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // Mock notifications data
  const [notifications] = useState([
    {
      id: 1,
      type: "appointment",
      title: "Appointment Confirmed",
      desc: "Your visit with Dr. Sarah for Bella is confirmed for tomorrow at 9:00 AM.",
      time: "2 hours ago",
      isRead: false,
      icon: appointmentIcon
    },
    {
      id: 2,
      type: "medical",
      title: "Lab Results Ready",
      desc: "Bella's blood work results have been uploaded to her medical records.",
      time: "5 hours ago",
      isRead: false,
      icon: medicalIcon
    },
    {
      id: 3,
      type: "payment",
      title: "Payment Successful",
      desc: "Transaction #PC-9982 for ₱1,200.00 has been processed successfully.",
      time: "Yesterday",
      isRead: true,
      icon: paymentIcon
    }
  ]);

  useEffect(() => {
    if (!user || user.role !== "pet_owner") {
      navigate("/login");
    }
  }, [navigate, user]);

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={pawLogo} alt="Logo" className="nav-logo" />
          <span>PawCruz</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-item" onClick={() => navigate("/pet-owner")}>
            <img src={dashboardIcon} alt="" className="nav-icon" />
            <span>Dashboard</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/pet-owner-appointments")}>
            <img src={appointmentIcon} alt="" className="nav-icon" />
            <span>Appointment</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/pet-owner-pets")}>
            <img src={petsIcon} alt="" className="nav-icon" />
            <span>My Pets</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/pet-owner-messages")}>
            <img src={messageIcon} alt="" className="nav-icon" />
            <span>Messages</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/pet-owner-records")}>
            <img src={medicalIcon} alt="" className="nav-icon" />
            <span>Medical Records</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/pet-owner-payments")}>
            <img src={paymentIcon} alt="" className="nav-icon" />
            <span>Payment History</span>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-area">
        <header className="top-bar">
          <h2>Notifications</h2>
          <div className="top-bar-right">
            <button className="notif-btn active-notif-page">
              <img src={bellIcon} alt="Notifications" className="top-icon" />
            </button>
            <div className="user-profile" onClick={() => navigate("/pet-owner-profile")}>
              <img src={userIcon} alt="User" className="top-avatar" />
            </div>
          </div>
        </header>

        <section className="dashboard-scroll-body">
            <div className="notif-header-action">
                <h3 className="section-title">Recent Activity</h3>
                <button className="mark-read-btn">Mark all as read</button>
            </div>
            
            <div className="notif-list">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div key={notif.id} className={`notif-card ${notif.isRead ? 'read' : 'unread'}`}>
                    <div className={`notif-icon-circle ${notif.type}`}>
                      <img src={notif.icon} alt="" className="tiny-icon" />
                    </div>
                    <div className="notif-content">
                      <div className="notif-top">
                        <h4>{notif.title}</h4>
                        <span className="notif-time">{notif.time}</span>
                      </div>
                      <p>{notif.desc}</p>
                    </div>
                    {!notif.isRead && <div className="unread-indicator"></div>}
                  </div>
                ))
              ) : (
                <div className="empty-notif-state">
                  <img src={bellIcon} alt="" className="large-faded-icon" />
                  <p>You have no new notifications at this time.</p>
                </div>
              )}
            </div>
        </section>
      </main>
    </div>
  );
};

export default PetOwnerNotif;