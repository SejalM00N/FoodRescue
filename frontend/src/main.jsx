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
import ProtectedRoute from "./context/ProtectedRoute.jsx";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/role-selection" element={<RoleSelection />} />

          {/* Donor routes */}
          <Route
            path="/donor-dashboard"
            element={
              <ProtectedRoute allowedRoles={["donor"]}>
                <DonorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-donation"
            element={
              <ProtectedRoute allowedRoles={["donor"]}>
                <CreateDonation />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-donations"
            element={
              <ProtectedRoute allowedRoles={["donor"]}>
                <MyDonations />
              </ProtectedRoute>
            }
          />

          <Route
            path="/donation-requests"
            element={
              <ProtectedRoute allowedRoles={["donor"]}>
                <DonationRequests />
              </ProtectedRoute>
            }
          />

          {/* NGO routes */}
          <Route
            path="/ngo-dashboard"
            element={
              <ProtectedRoute allowedRoles={["ngo"]}>
                <NGODashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/find-food"
            element={
              <ProtectedRoute allowedRoles={["ngo"]}>
                <FindFood />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ngo-requests"
            element={
              <ProtectedRoute allowedRoles={["ngo"]}>
                <NGORequests />
              </ProtectedRoute>
            }
          />

          {/* Volunteer routes */}
          <Route
            path="/volunteer-dashboard"
            element={
              <ProtectedRoute allowedRoles={["volunteer"]}>
                <VolunteerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/volunteer-map"
            element={
              <ProtectedRoute allowedRoles={["volunteer"]}>
                <VolunteerMap />
              </ProtectedRoute>
            }
          />

          <Route
            path="/available-pickups"
            element={
              <ProtectedRoute allowedRoles={["volunteer"]}>
                <AvailablePickups />
              </ProtectedRoute>
            }
          />

          <Route
            path="/lets-deliver"
            element={
              <ProtectedRoute allowedRoles={["volunteer"]}>
                <LetsDeliver />
              </ProtectedRoute>
            }
          />

          <Route
            path="/delivery-tracking"
            element={
              <ProtectedRoute allowedRoles={["volunteer"]}>
                <DeliveryTracking />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-deliveries"
            element={
              <ProtectedRoute allowedRoles={["volunteer"]}>
                <MyDeliveries />
              </ProtectedRoute>
            }
          />

          {/* NGO verification */}
          <Route
            path="/ngo-verification"
            element={
              <ProtectedRoute allowedRoles={["ngo"]}>
                <NGOVerification />
              </ProtectedRoute>
            }
          />

          {/* Other protected routes */}
          <Route
            path="/success"
            element={
              <ProtectedRoute>
                <Success />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
