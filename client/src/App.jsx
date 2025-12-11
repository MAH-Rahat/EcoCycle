// client/src/App.jsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx'; 
import Signup from './pages/Signup.jsx';
import Home from './pages/Home.jsx'; 
import LogWaste from './pages/LogWaste.jsx'; 
import AdminDashboard from './pages/AdminDashboard.jsx'; 
import AdminWasteManager from './pages/AdminWasteManager.jsx'; // <-- NEW IMPORT

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/home" element={<Home />} />
        <Route path="/log-waste" element={<LogWaste />} /> 
        
        {/* Admin Routes */}
        <Route path="/admin-panel" element={<AdminDashboard />} /> 
        <Route path="/admin/waste" element={<AdminWasteManager />} /> {/* <-- NEW WASTE MANAGER ROUTE */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;