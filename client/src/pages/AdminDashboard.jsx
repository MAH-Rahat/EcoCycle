import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    LogOut, Settings, User, Package, Megaphone, 
    Gift, BarChart3, LayoutDashboard, ChevronRight, 
    Activity, Bell 
} from 'lucide-react';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [adminName, setAdminName] = useState('');

    useEffect(() => {
        const userInfoString = localStorage.getItem('userInfo');
        const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
        
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

    const ControlCard = ({ icon: Icon, title, description, color, link, badge }) => (
        <div 
            onClick={() => navigate(link)} 
            className="group relative bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-indigo-400/50 transition-all duration-300 cursor-pointer"
        >
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-4 rounded-2xl ${color} shadow-lg shadow-current/10 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-6 w-6 text-white" />
                    </div>
                    {badge && (
                        <span className="bg-amber-100 text-amber-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                            {badge}
                        </span>
                    )}
                </div>
                
                <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center">
                    {title}
                    <ChevronRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex overflow-hidden font-sans">
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-6">
                    <div className="flex items-center gap-3 text-white mb-10">
                        <div className="bg-indigo-500 p-2 rounded-xl">
                            <Activity className="h-6 w-6" />
                        </div>
                        <span className="text-xl font-black tracking-tighter uppercase">EcoCycle</span>
                    </div>

                    <nav className="space-y-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 ml-2">Main Menu</p>
                        <button className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-600 text-white rounded-xl transition shadow-lg shadow-indigo-500/20">
                            <LayoutDashboard size={18} /> <span className="text-sm font-bold">Overview</span>
                        </button>
                        <button onClick={() => navigate('/admin/analytics')} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-xl transition">
                            <BarChart3 size={18} /> <span className="text-sm font-bold">Analytics</span>
                        </button>
                        {/* SIDEBAR USER MANAGER LINK */}
                        <button onClick={() => navigate('/admin/users')} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-xl transition">
                            <User size={18} /> <span className="text-sm font-bold">User Manager</span>
                        </button>
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-slate-800">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-rose-400 hover:bg-rose-500/10 rounded-xl transition font-bold text-sm">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto relative">
                <header className="sticky top-0 z-10 bg-slate-50/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Admin Dashboard</h2>
                        <p className="text-slate-800 font-bold">Welcome back, {adminName}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-400 hover:text-slate-800 transition relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-50"></span>
                        </button>
                        <div className="h-10 w-10 bg-indigo-100 border border-indigo-200 rounded-full flex items-center justify-center text-indigo-600 font-black">
                            {adminName.charAt(0)}
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
                            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl"><Package size={24}/></div>
                            <div><p className="text-xs text-slate-400 font-bold uppercase">System Status</p><p className="font-black text-slate-800">Operational</p></div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
                            <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl"><Activity size={24}/></div>
                            <div><p className="text-xs text-slate-400 font-bold uppercase">Traffic</p><p className="font-black text-slate-800">Stable</p></div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
                            <div className="bg-amber-50 text-amber-600 p-3 rounded-2xl"><Settings size={24}/></div>
                            <div><p className="text-xs text-slate-400 font-bold uppercase">Environment</p><p className="font-black text-slate-800">Production</p></div>
                        </div>
                    </div>

                    <h2 className="text-2xl font-black text-slate-800 mb-8 tracking-tight">Management Console</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <ControlCard 
                            icon={Package} 
                            title="Waste Logistics" 
                            description="Review and process pickup requests across the city." 
                            color="bg-indigo-500"
                            link="/admin/waste" 
                            badge="Active"
                        />
                        <ControlCard 
                            icon={Megaphone} 
                            title="Awareness Hub" 
                            description="Push news and recycling facts to the citizen app." 
                            color="bg-orange-500"
                            link="/admin/campaigns"
                        />
                        <ControlCard 
                            icon={Gift} 
                            title="Rewards Engine" 
                            description="Issue vouchers and manage the EcoPoint marketplace." 
                            color="bg-purple-500"
                            link="/admin/rewards"
                        />
                        <ControlCard 
                            icon={BarChart3} 
                            title="Intelligence" 
                            description="Deep dive into recycling trends and user activity." 
                            color="bg-blue-500"
                            link="/admin/analytics"
                        />
                        {/* ACCESS CONTROL CARD */}
                        <ControlCard 
                            icon={User} 
                            title="Access Control" 
                            description="View registered citizens and manage permissions." 
                            color="bg-slate-700"
                            link="/admin/users"
                        />
                        <ControlCard 
                            icon={Settings} 
                            title="Maintenance" 
                            description="Technical diagnostics and database health tools." 
                            color="bg-rose-500"
                            link="/admin/diagnostics"
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}