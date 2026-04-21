import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../../css/PetOwnerProfile.css";
import PetOwnerSidebar from "../../../components/PetOwnerSidebar";
import { useSidebar } from "../../../components/useSidebar";

// ASSETS
import appointmentIcon from "../../../assets/Appointment_Icon.png";
import bellIcon from "../../../assets/Bell_Icon.png";
import dashboardIcon from "../../../assets/Dashboard_Icon.png";
import medicalIcon from "../../../assets/Medical_Icon.png";
import messageIcon from "../../../assets/Message_Icon.png";
import pawLogo from "../../../assets/paw.png";
import paymentIcon from "../../../assets/payment_icon.png";
import petsIcon from "../../../assets/Pets_Icon.png";
import userIcon from "../../../assets/Profile.png";

const PetOwnerProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const { isOpen, toggle, close } = useSidebar();

  useEffect(() => {
    if (!user || user.role !== "pet_owner") {
      navigate("/login");
    }
  }, [navigate, user]);

  const handleLogout = () => {
    // Clear local storage to end session
    localStorage.removeItem("user");
    localStorage.removeItem("token"); 
    // Redirect to login page
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <PetOwnerSidebar isOpen={isOpen} onClose={close} />

      {/* MAIN CONTENT */}
      <main className="main-area">
        <header className="top-bar">
          <button className="hamburger-btn" onClick={toggle} aria-label="Toggle menu"><span /><span /><span /></button>
          <h2>My Profile</h2>
          <div className="top-bar-right">
            <button className="notif-btn" onClick={() => navigate("/pet-owner-notifications")}>
              <img src={bellIcon} alt="Notifications" />
            </button>
            <div className="user-profile" onClick={() => navigate("/pet-owner-profile")}>
              <img src={userIcon} alt="User" />
            </div>
          </div>
        </header>

        <section className="content-body">
            <div className="dashboard-welcome-card">
              <h3>Profile Information</h3>
              <p>Manage your account details and preferences.</p>
            </div>
        </section>
      </main>
    </div>
  );
};

export default PetOwnerProfile;