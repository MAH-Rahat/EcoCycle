import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Home from "./pages/Home.jsx";
import LogWaste from "./pages/LogWaste.jsx";
import MyActivity from "./pages/MyActivity.jsx";

import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminWasteManager from "./pages/AdminWasteManager.jsx";
import AdminCampaigns from "./pages/AdminCampaigns.jsx";
import AdminRewards from "./pages/AdminRewards.jsx";
import AdminAnalytics from "./pages/AdminAnalytics.jsx";
import UserManager from "./pages/UserManager.jsx";

import CollectorDashboard from "./CollectorDashboard.jsx";
import GoogleMapsNavigation from "./GoogleMapsNavigation.jsx";
import QRCodeVerification from "./QRCodeVerification.jsx";
import CollectionReport from "./CollectionReport.jsx";

import LivePickupStatus from "./pages/livepickup.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Citizen */}
        <Route path="/home" element={<Home />} />
        <Route path="/log-waste" element={<LogWaste />} />
        <Route path="/my-activity" element={<MyActivity />} />

        {/* Live pickup (support both URLs to avoid mismatch bugs) */}
        <Route path="/livepickup" element={<LivePickupStatus />} />
        <Route path="/live-pickup" element={<LivePickupStatus />} />

        {/* Admin */}
        <Route path="/admin-panel" element={<AdminDashboard />} />
        <Route path="/admin/waste" element={<AdminWasteManager />} />
        <Route path="/admin/campaigns" element={<AdminCampaigns />} />
        <Route path="/admin/rewards" element={<AdminRewards />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/users" element={<UserManager />} />

        {/* Collector */}
        <Route path="/collector-dashboard" element={<CollectorDashboard />} />

        {/* Maps (support both URLs) */}
        <Route path="/collector-maps" element={<GoogleMapsNavigation />} />
        <Route path="/navigate" element={<GoogleMapsNavigation />} />

        <Route path="/collector-scan" element={<QRCodeVerification />} />
        <Route path="/collector-report" element={<CollectionReport />} />

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
