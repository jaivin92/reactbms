import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/layouts/AppLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import Dashboard from "@/pages/Dashboard";
import Buildings from "@/pages/Buildings";
import Users from "@/pages/Users";
import Billing from "@/pages/Billing";
import Parking from "@/pages/Parking";
import Visitors from "@/pages/Visitors";
import Canteen from "@/pages/Canteen";
import Complaints from "@/pages/Complaints";
import Voting from "@/pages/Voting";
import Notices from "@/pages/Notices";
import Settings from "@/pages/Settings";
import Profile from "@/pages/Profile";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="buildings" element={<ProtectedRoute roles={["SuperAdmin","BuildingAdmin"]}><Buildings /></ProtectedRoute>} />
              <Route path="users" element={<ProtectedRoute roles={["SuperAdmin","BuildingAdmin"]}><Users /></ProtectedRoute>} />
              <Route path="billing" element={<Billing />} />
              <Route path="parking" element={<Parking />} />
              <Route path="visitors" element={<Visitors />} />
              <Route path="canteen" element={<Canteen />} />
              <Route path="complaints" element={<Complaints />} />
              <Route path="voting" element={<Voting />} />
              <Route path="notices" element={<Notices />} />
              <Route path="settings" element={<Settings />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
