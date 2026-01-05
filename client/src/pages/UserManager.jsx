import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, User, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UserManager() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.get(`${apiUrl}/api/users/all-citizens`);
            setUsers(Array.isArray(res.data) ? res.data : []); 
            setError(null);
        } catch (err) {
            console.error("Fetch Error:", err);
            setError("Could not load users. Check your backend connection.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const deleteUser = async (id) => {
        if (window.confirm("Permanently remove this citizen?")) {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                await axios.delete(`${apiUrl}/api/users/${id}`);
                setUsers(users.filter(u => u._id !== id));
            } catch (err) {
                alert("Action failed.");
            }
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center font-bold text-indigo-600">Loading...</div>;

    return (
        <div className="p-8 bg-slate-50 min-h-screen font-sans">
            <button onClick={() => navigate('/admin-panel')} className="flex items-center gap-2 text-slate-500 mb-6 font-bold"><ArrowLeft size={20}/> Back</button>
            {error && <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-rose-600 flex items-center gap-3 mb-6"><AlertCircle size={20}/> {error}</div>}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-900 text-slate-200">
                        <tr><th className="p-5">Citizen</th><th className="p-5">Email</th><th className="p-5 text-right">Delete</th></tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u._id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                                <td className="p-5 flex items-center gap-3 font-bold text-slate-700">{u.name}</td>
                                <td className="p-5 text-slate-500">{u.email}</td>
                                <td className="p-5 text-right"><button onClick={() => deleteUser(u._id)} className="p-2 text-rose-500"><Trash2 size={18}/></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}