import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, User, Package, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [adminName, setAdminName] = useState('');

    useEffect(() => {
        const userInfoString = localStorage.getItem('userInfo');
        const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
        
        // --- Security Check ---
        if (!userInfo || userInfo.role !== 'admin') {
            navigate('/login');
            return;
        }

        setAdminName(userInfo.name || 'Administrator');
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    const ControlCard = ({ icon: Icon, title, description, color, link }) => {
        const handleClick = () => {
            if (link) {
                navigate(link);
            } else {
                alert(`Feature Coming Soon: ${title}`);
            }
        };

        return (
            <div 
                onClick={handleClick} 
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:border-indigo-400 transition-all duration-300 cursor-pointer"
            >
                <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${color}`}>
                        <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                        <p className="text-sm text-gray-500">{description}</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* --- Navigation Bar --- */}
            <header className="bg-gray-800 shadow-xl">
                <div className="max-w-6xl mx-auto px-4 flex justify-between items-center h-16">
                    <div className="text-2xl font-bold text-white flex items-center space-x-2">
                        <Settings className="h-6 w-6 text-[#4CAF50]" />
                        <span>Admin Panel</span>
                    </div>
                    <button onClick={handleLogout} className="flex items-center space-x-2 text-red-400 hover:text-white transition">
                        <LogOut className="h-5 w-5" />
                        <span className="text-sm font-medium">Logout</span>
                    </button>
                </div>
            </header>

            {/* --- Main Control Area --- */}
            <main className="max-w-6xl mx-auto py-10 px-4">
                <div className="mb-8 p-6 bg-white rounded-xl shadow-lg border-l-4 border-gray-500">
                    <h1 className="text-3xl font-extrabold text-gray-800 mb-1">
                        Welcome, {adminName}!
                    </h1>
                    <p className="text-lg text-gray-600">
                        System Oversight and Management Console
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ControlCard 
                        icon={Package} 
                        title="Manage Waste Requests" 
                        description="Approve, reject, or assign all pending pickup requests." 
                        color="bg-indigo-600"
                        link="/admin/waste" // <-- CORRECTED LINK
                    />
                    <ControlCard 
                        icon={User} 
                        title="User Management" 
                        description="View, edit, or block citizen and collector accounts." 
                        color="bg-blue-600"
                        link="/admin/users"
                    />
                    <ControlCard 
                        icon={DollarSign} 
                        title="Set EcoPoint Rates" 
                        description="Adjust the point value for different material types." 
                        color="bg-[#4CAF50]"
                        link="/admin/rates"
                    />
                    <ControlCard 
                        icon={Settings} 
                        title="System Diagnostics" 
                        description="Check API status and database health." 
                        color="bg-red-600"
                        link="/admin/diagnostics"
                    />
                </div>
            </main>
        </div>
    );
}