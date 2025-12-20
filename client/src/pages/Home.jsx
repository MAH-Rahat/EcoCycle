import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, Zap, Package, Clock, TrendingUp, Compass, Newspaper, Calendar, Info } from 'lucide-react'; 

// --- CRITICAL: IMPORT ASSETS ---
import backgroundRecycle from '../assets/background-recycle.jpg'; 
import heroPic1 from '../assets/hero-pic-1.jpg'; 
import heroPic2 from '../assets/hero-pic-2.jpg'; 
// --------------------------------

const ContentCard = ({ title, snippet, tag, date }) => (
    <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200 cursor-pointer group">
        <div className="flex justify-between items-start mb-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                tag === 'Event' ? 'bg-orange-100 text-orange-700' : 
                tag === 'Recycling Fact' ? 'bg-green-100 text-green-700' : 
                'bg-blue-100 text-blue-700'
            }`}>
                {tag}
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase">{date}</span>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-[#4CAF50] transition-colors">{title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{snippet}</p>
    </div>
);

const StatDisplay = ({ icon: Icon, value, unit }) => (
    <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full border border-gray-300 shadow-sm">
        <Icon className="h-5 w-5 text-yellow-600" />
        <span className="font-bold text-yellow-700 text-lg">{value} <span className="text-sm font-medium">{unit}</span></span>
    </div>
);

const NavLink = ({ to, label, navigate }) => (
    <a 
        onClick={() => navigate(to)} 
        className="text-gray-600 text-sm hover:text-[#4CAF50] transition font-medium cursor-pointer"
    >
        {label}
    </a>
);

export default function Home() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);
    const [campaigns, setCampaigns] = useState([]); // NEW: State for Admin Posts

    // Dynamic State Variables
    const [userStats, setUserStats] = useState({ points: 0, itemsLogged: 0 }); 

    const StatCard = ({ icon: Icon, title, value, unit, colorClass, shadowClass }) => (
        <div className={`bg-white p-5 rounded-xl shadow-lg border border-gray-200 flex flex-col justify-between transform transition-all duration-200 hover:shadow-xl hover:border-[#4CAF50]`}>
            <div className="flex items-center space-x-3 mb-2">
                <div className={`p-2 rounded-lg ${shadowClass} bg-opacity-10`}>
                    <Icon className={`h-6 w-6 ${colorClass}`} />
                </div>
                <p className="text-sm text-gray-500 uppercase font-semibold">{title}</p>
            </div>
            <h3 className="text-3xl font-extrabold text-gray-800 leading-none">
                {value} <span className="text-base font-medium text-gray-400">{unit}</span>
            </h3>
        </div>
    );
    
    // Fetch live user stats
    const fetchUserStats = async (userId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/waste/stats/${userId}`);
            setUserStats(res.data);
        } catch (error) {
            console.error("Failed to fetch stats:", error);
            setUserStats({ points: 0, itemsLogged: 0 });
        }
    };

    // --- NEW: Fetch Admin Awareness Campaigns ---
    const fetchCampaigns = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/campaigns');
            setCampaigns(res.data);
        } catch (error) {
            console.error("Failed to fetch campaigns:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const userInfoString = localStorage.getItem('userInfo');
        
        if (userInfoString) {
            const user = JSON.parse(userInfoString);
            setUserName(user.name || 'Citizen'); 
            fetchUserStats(user._id); 
            fetchCampaigns(); // Fetch news on load
        } else {
            setLoading(false);
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-[#4CAF50] font-semibold tracking-widest animate-pulse">LOADING ECO-DASHBOARD...</div>;
    }
    
    if (!userName) {
        return null; 
    }

    return (
        <div className="min-h-screen relative overflow-hidden font-sans">
            {/* Blurred Background Logic */}
            <div 
                className="absolute inset-0 bg-cover bg-center z-0" 
                style={{ backgroundImage: `url(${backgroundRecycle})`, filter: 'blur(8px)', transform: 'scale(1.05)' }}
            />
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-0" />
            
            {/* Navigation Bar */}
            <header className="bg-white/95 shadow-md sticky top-0 z-20 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 flex justify-between items-center h-16">
                    <div className="text-2xl font-black text-[#4CAF50] tracking-tighter">EcoCycle</div>
                    <nav className="flex space-x-4 items-center">
                        <NavLink to="/home" label="Home" navigate={navigate} />
                        <NavLink to="/my-activity" label="My Activity" navigate={navigate} />
                        <NavLink to="#" label="Community" navigate={navigate} />
                        
                        <StatDisplay icon={Zap} value={userStats.points} unit="pts" /> 

                        <button onClick={handleLogout} className="flex items-center space-x-1 text-red-500 hover:text-red-700 transition ml-4">
                            <LogOut className="h-5 w-5" />
                        </button>
                    </nav>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6 relative z-10">
                
                {/* Welcome Header */}
                <div className="mb-10 p-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl border-l-4 border-[#4CAF50] animate-fadeIn">
                    <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
                                Hi, <span className="text-[#4CAF50]">{userName.split(' ')[0]}!</span>
                            </h1>
                            <p className="text-lg text-gray-600 mb-6 font-medium">Ready to log your next contribution?</p>
                            
                            <div className="flex space-x-3">
                                <button 
                                    onClick={() => navigate('/log-waste')} 
                                    className="flex items-center justify-center space-x-2 bg-[#4CAF50] text-white font-bold px-5 py-2.5 rounded-xl 
                                                hover:bg-[#388E3C] transition-all duration-200 shadow-lg shadow-green-100 text-base active:scale-95">
                                    <Package className="h-5 w-5"/>
                                    <span>Log Waste</span>
                                </button>

                                <button 
                                    onClick={() => navigate('/my-activity')}
                                    className="flex items-center justify-center space-x-2 border-2 border-gray-200 bg-white text-gray-700 font-bold px-5 py-2.5 rounded-xl 
                                               hover:bg-gray-50 transition-all duration-200 text-base active:scale-95">
                                    <Clock className="h-5 w-5"/>
                                    <span>Pickup Request</span>
                                </button>
                            </div>
                        </div>

                        {/* Hero Pictures */}
                        <div className="hidden md:flex space-x-4 ml-6 items-start">
                            <div className="w-40 h-28 overflow-hidden rounded-2xl shadow-2xl border-4 border-white animate-shiftUp">
                                <img src={heroPic1} alt="Recycling Art" className="w-full h-full object-cover" />
                            </div>
                            <div className="w-40 h-28 overflow-hidden rounded-2xl shadow-2xl border-4 border-white animate-shiftDown delay-100">
                                <img src={heroPic2} alt="Recycling Hand" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Key Metrics Grid */}
                <h2 className="text-xl font-black text-gray-700 mb-4 uppercase tracking-wider border-b-2 border-gray-200 pb-2 flex items-center gap-2">
                    <TrendingUp size={20} className="text-[#4CAF50]"/> Quick Stats
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 animate-fadeIn delay-200">
                    <StatCard 
                        icon={TrendingUp} 
                        title="Items Logged" 
                        value={userStats.itemsLogged} 
                        unit="items" 
                        colorClass="text-indigo-600"
                        shadowClass="bg-indigo-100"
                    />
                    <StatCard 
                        icon={Zap} 
                        title="Total Points" 
                        value={userStats.points} 
                        unit="pts"
                        colorClass="text-yellow-600"
                        shadowClass="bg-yellow-100"
                    />
                    <StatCard 
                        icon={Compass} 
                        title="Next Goal" 
                        value="Silver" 
                        unit="Tier"
                        colorClass="text-amber-600"
                        shadowClass="bg-amber-100"
                    />
                </div>

                {/* --- UPDATED: Live Awareness Campaigns Section --- */}
                <h2 className="text-xl font-black text-gray-700 mt-12 mb-4 uppercase tracking-wider border-b-2 border-gray-200 pb-2 flex items-center gap-2">
                    <Newspaper size={20} className="text-[#4CAF50]"/> Awareness & News
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn delay-300 mb-20">
                    {campaigns.length > 0 ? (
                        campaigns.map((post) => (
                            <ContentCard 
                                key={post._id}
                                title={post.title} 
                                snippet={post.content} 
                                tag={post.category} 
                                date={new Date(post.createdAt).toLocaleDateString()}
                            />
                        ))
                    ) : (
                        <div className="col-span-2 py-10 bg-white/50 rounded-2xl border-2 border-dashed border-gray-300 text-center text-gray-400 font-bold">
                            No news updates at the moment.
                        </div>
                    )}
                </div>

            </main>

            {/* Animations */}
            <style jsx="true">{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.8s ease-out forwards;
                }
                .delay-100 { animation-delay: 0.1s; }
                .delay-200 { animation-delay: 0.2s; }
                .delay-300 { animation-delay: 0.3s; }
                
                @keyframes shiftUp {
                    0% { transform: translateY(8px); }
                    50% { transform: translateY(0px); }
                    100% { transform: translateY(8px); }
                }
                @keyframes shiftDown {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(8px); }
                    100% { transform: translateY(0px); }
                }
                .animate-shiftUp { animation: shiftUp 5s infinite ease-in-out; }
                .animate-shiftDown { animation: shiftDown 5s infinite ease-in-out; }
            `}</style>
        </div>
    );
}