import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx'; 
import Signup from './pages/Signup.jsx';
import Home from './pages/Home.jsx'; 
import LogWaste from './pages/LogWaste.jsx'; 
import AdminDashboard from './pages/AdminDashboard.jsx'; 
import AdminWasteManager from './pages/AdminWasteManager.jsx'; 
import MyActivity from './pages/MyActivity.jsx'; 
import AdminCampaigns from './pages/AdminCampaigns.jsx'; 
import AdminRewards from './pages/AdminRewards.jsx'; 
import AdminAnalytics from './pages/AdminAnalytics.jsx'; 
import UserManager from './pages/UserManager.jsx'; 

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

        {/* Admin Management */}
        <Route path="/admin-panel" element={<AdminDashboard />} /> 
        <Route path="/admin/waste" element={<AdminWasteManager />} /> 
        <Route path="/admin/campaigns" element={<AdminCampaigns />} />
        <Route path="/admin/rewards" element={<AdminRewards />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/users" element={<UserManager />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;