import "leaflet/dist/leaflet.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Register from "./pages/Register.jsx";
import RoleSelection from "./pages/RoleSelection.jsx";
import DonorDashboard from "./pages/DonorDashboard.jsx";
import CreateDonation from "./pages/CreateDonation.jsx";
import MyDonations from "./pages/MyDonations.jsx";
import DonationRequests from "./pages/DonationRequests.jsx";
import NGODashboard from "./pages/NGODashboard.jsx";
import FindFood from "./pages/FindFood.jsx";
import NGORequests from "./pages/NGORequests.jsx";
import VolunteerDashboard from "./pages/VolunteerDashboard.jsx";
import VolunteerMap from "./pages/VolunteerMap.jsx";
import AvailablePickups from "./pages/AvailablePickups.jsx";
import LetsDeliver from "./pages/LetsDeliver.jsx";
import DeliveryTracking from "./pages/DeliveryTracking.jsx";
import MyDeliveries from "./pages/MyDeliveries.jsx";
import NGOVerification from "./pages/NGOVerification.jsx";
import Success from "./pages/Success.jsx";
import Settings from "./pages/Settings.jsx";

import { AuthProvider } from "./context/AuthContext.jsx";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/role-selection" element={<RoleSelection />} />

          <Route path="/donor-dashboard" element={<DonorDashboard />} />
          <Route path="/create-donation" element={<CreateDonation />} />
          <Route path="/my-donations" element={<MyDonations />} />
          <Route path="/donation-requests" element={<DonationRequests />} />

          <Route path="/ngo-dashboard" element={<NGODashboard />} />
          <Route path="/find-food" element={<FindFood />} />
          <Route path="/ngo-requests" element={<NGORequests />} />

          <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
          <Route path="/volunteer-map" element={<VolunteerMap />} />
          <Route path="/available-pickups" element={<AvailablePickups />} />
          <Route path="/lets-deliver" element={<LetsDeliver />} />
          <Route path="/delivery-tracking" element={<DeliveryTracking />} />
          <Route path="/my-deliveries" element={<MyDeliveries />} />
          <Route path="/ngo-verification" element={<NGOVerification />} />

          <Route path="/success" element={<Success />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
