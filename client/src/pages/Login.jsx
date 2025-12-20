import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, LogIn, Zap } from 'lucide-react'; // UserCheck is removed as it was only used for the demo button

// --- SENIOR FIX: Define Helper Component OUTSIDE the main function for stability ---
const FloatingInputField = ({ icon: Icon, name, type, label, value, onChange, required=false }) => (
    <div className="relative z-0 group">
        <input
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            className="block w-full py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-[#84CC16] peer transition-all duration-300"
            placeholder=" "
            required={required}
        />
        <label 
            className={`absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-[#84CC16]`}
        >
            <div className="flex items-center space-x-2">
                <Icon className="h-4 w-4" />
                <span>{label}</span>
            </div>
        </label>
    </div>
);
// ----------------------------------------------------------------------------------

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- REMOVED: handleDemoLogin function is no longer needed ---

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            
            if (res.data) {
                localStorage.setItem('userInfo', JSON.stringify(res.data));
                
                if (res.data.role === 'citizen') navigate('/home'); 
                else if (res.data.role === 'collector') navigate('/collector-dashboard');
                else if (res.data.role === 'admin') navigate('/admin-panel'); 
            }
        } catch (error) {
            console.error("Login Error:", error); 
            alert(error.response?.data?.message || "Login failed");
        }
    };

    return (
        // Reintroducing a dark theme with a dramatic background
        <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden p-4">
            
            {/* --- Dynamic Background --- */}
            <div className="absolute inset-0 z-0">
                {/* Large animated gradient/blob for visual interest */}
                <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#84CC16] opacity-30 rounded-full mix-blend-lighten filter blur-3xl animate-blob" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500 opacity-20 rounded-full mix-blend-lighten filter blur-3xl animate-blob animation-delay-4000" />
            </div>

            {/* --- Login Card (Glassmorphism Effect) --- */}
            <div 
                className="relative bg-white/10 backdrop-blur-md border border-white/20 p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-700 animate-fadeInUp z-10"
            >
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-[#84CC16] drop-shadow-lg mb-1 flex items-center justify-center space-x-2">
                        <Zap className="h-8 w-8"/>
                        <span>EcoCycle Login</span>
                    </h1>
                    <p className="text-lg font-light text-gray-200 mt-2">Access your green journey dashboard.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    
                    <FloatingInputField 
                        icon={Mail} 
                        name="email" 
                        type="email" 
                        label="Email Address" 
                        value={formData.email}
                        onChange={handleChange}
                        required={true}
                    />

                    <FloatingInputField 
                        icon={Lock} 
                        name="password" 
                        type="password" 
                        label="Password" 
                        value={formData.password}
                        onChange={handleChange}
                        required={true}
                    />

                    <button 
                        type="submit"
                        className="w-full flex items-center justify-center space-x-2 bg-[#84CC16] text-gray-900 font-extrabold py-4 rounded-xl mt-4 
                                   hover:bg-[#65a30d] transition-all duration-300 shadow-xl shadow-lime-900/40 text-lg uppercase tracking-wider 
                                   transform hover:scale-[1.02] active:scale-95 ease-in-out">
                        <LogIn className="h-6 w-6"/>
                        <span>Sign In</span>
                    </button>
                    
                    {/* --- REMOVED: Demo Button HTML block is removed --- */}
                </form>

                <div className="text-center mt-8 pt-4 border-t border-white/10">
                    <p className="text-gray-400 text-sm">
                        New here? 
                        <Link to="/signup" className="text-blue-400 font-medium ml-2 hover:text-blue-300 transition-colors">
                            Create an Account
                        </Link>
                    </p>
                </div>
            </div>
            
            {/* CSS for custom animation */}
            <style jsx="true">{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeInUp {
                    animation: fadeInUp 1s ease-out;
                }
                @keyframes blob {
                    0% {
                        transform: translate(0px, 0px) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                    100% {
                        transform: translate(0px, 0px) scale(1);
                    }
                }
                .animate-blob {
                    animation: blob 10s infinite cubic-bezier(0.42, 0, 0.58, 1);
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
}