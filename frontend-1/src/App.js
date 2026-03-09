import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { initCSRF } from "./api/api";

// AUTH & SECURITY IMPORTS
import Login from "./pages/Login";
import Register from "./pages/Register";
import UnlockAccount from "./pages/security/UnlockAccount";
import VerifyEmail from "./pages/security/VerifyEmail";
import ResetPassword from "./pages/security/password/ResetPassword";

// DASHBOARD IMPORTS
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import StaffDashboard from "./pages/dashboards/StaffDashboard";

// ADMIN NEW IMPORTS
import AdminMessages from "./pages/dashboards/AdminMessages";
import AdminNotif from "./pages/dashboards/AdminNotif";
import AdminProfile from "./pages/dashboards/AdminProfile";
import AdminUserManagement from "./pages/dashboards/AdminUserManagement";

// STAFF IMPORTS
import StaffActivityLog from "./pages/dashboards/StaffActivityLog";
import StaffAppointment from "./pages/dashboards/StaffAppointment";
import StaffInventory from "./pages/dashboards/StaffInventory";
import StaffMessages from "./pages/dashboards/StaffMessages";
import StaffNotif from "./pages/dashboards/StaffNotif";
import StaffPaymentHistory from "./pages/dashboards/StaffPaymentHistory";
import StaffPetsProfile from "./pages/dashboards/StaffPetsProfile";
import StaffProfile from "./pages/dashboards/StaffProfile";
import StaffUserManagement from "./pages/dashboards/StaffUserManagement";

// VETERINARIAN IMPORTS
import VetCalendar from "./pages/dashboards/VetCalendar";
import VetDashboard from "./pages/dashboards/VetDashboard";
import VetInventory from "./pages/dashboards/VetInventory";
import VetMedRec from "./pages/dashboards/VetMedRec";
import VetMessages from "./pages/dashboards/VetMessages";
import VetNotif from "./pages/dashboards/VetNotif";
import VetPatients from "./pages/dashboards/VetPatients";
import VetProfile from "./pages/dashboards/VetProfile";

// PET OWNER IMPORTS
import PetOwnerAppointment from "./pages/dashboards/PetOwnerAppointment";
import PetOwnerDashboard from "./pages/dashboards/PetOwnerDashboard";
import PetOwnerMedRec from "./pages/dashboards/PetOwnerMedRec";
import PetOwnerMessages from "./pages/dashboards/PetOwnerMessages";
import PetOwnerMyPets from "./pages/dashboards/PetOwnerMyPets";
import PetOwnerNotif from "./pages/dashboards/PetOwnerNotif";
import PetOwnerPayHis from "./pages/dashboards/PetOwnerPayHis";
import PetOwnerProfile from "./pages/dashboards/PetOwnerProfile";

function App() {
  useEffect(() => { 
    initCSRF(); 
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC / AUTH ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* SECURITY FLOW ROUTES */}
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/unlock-account/:token" element={<UnlockAccount />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        
        {/* PET OWNER DASHBOARD ROUTES */}
        <Route path="/pet-owner" element={<PetOwnerDashboard />} />
        <Route path="/pet-owner-appointments" element={<PetOwnerAppointment />} />
        <Route path="/pet-owner-pets" element={<PetOwnerMyPets />} />
        <Route path="/pet-owner-messages" element={<PetOwnerMessages />} />
        <Route path="/pet-owner-records" element={<PetOwnerMedRec />} />
        <Route path="/pet-owner-payments" element={<PetOwnerPayHis />} />
        <Route path="/pet-owner-notifications" element={<PetOwnerNotif />} />
        <Route path="/pet-owner-profile" element={<PetOwnerProfile />} />

        {/* VETERINARIAN DASHBOARD ROUTES */}
        <Route path="/vet" element={<VetDashboard />} />
        <Route path="/vet-patients" element={<VetPatients />} />
        <Route path="/vet-calendar" element={<VetCalendar />} />
        <Route path="/vet-messages" element={<VetMessages />} />
        <Route path="/vet-medical-records" element={<VetMedRec />} />
        <Route path="/vet-inventory" element={<VetInventory />} />
        <Route path="/vet-notifications" element={<VetNotif />} />
        <Route path="/vet-profile" element={<VetProfile />} />

        {/* STAFF ROUTES */}
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/staff-appointments" element={<StaffAppointment />} />
        <Route path="/staff-users" element={<StaffUserManagement />} />
        <Route path="/staff-pets" element={<StaffPetsProfile />} />
        <Route path="/staff-messages" element={<StaffMessages />} />
        <Route path="/staff-inventory" element={<StaffInventory />} />
        <Route path="/staff-payments" element={<StaffPaymentHistory />} />
        <Route path="/staff-activity" element={<StaffActivityLog />} />
        <Route path="/staff-notifications" element={<StaffNotif />} />
        <Route path="/staff-profile" element={<StaffProfile />} />

        {/* ADMIN ROUTES */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin-users" element={<AdminUserManagement />} />
        <Route path="/admin-messages" element={<AdminMessages />} />
        <Route path="/admin-notifications" element={<AdminNotif />} />
        <Route path="/admin-profile" element={<AdminProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;