import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx'; 
import Signup from './pages/Signup.jsx';
import Home from './pages/Home.jsx'; 
import LogWaste from './pages/LogWaste.jsx'; 
import AdminDashboard from './pages/AdminDashboard.jsx'; 
import AdminWasteManager from './pages/AdminWasteManager.jsx'; 
import MyActivity from './pages/MyActivity';
import AdminCampaigns from './pages/AdminCampaigns.jsx'; 
import AdminRewards from './pages/AdminRewards.jsx'; 

// --- NEW IMPORT ---
import AdminAnalytics from './pages/AdminAnalytics.jsx'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/log-waste" element={<LogWaste />} /> 
        <Route path="/my-activity" element={<MyActivity />} />

        {/* Admin Routes */}
        <Route path="/admin-panel" element={<AdminDashboard />} /> 
        <Route path="/admin/waste" element={<AdminWasteManager />} /> 
        <Route path="/admin/campaigns" element={<AdminCampaigns />} />
        <Route path="/admin/rewards" element={<AdminRewards />} />
        
        {/* --- NEW ANALYTICS ROUTE --- */}
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;