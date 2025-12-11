import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // <--- NEW: Import Axios for API calls
import { Trash2, Weight, Camera, LogOut, Package, HardHat, Feather, Zap, GlassWater, Recycle, ArrowLeft } from 'lucide-react'; 

export default function LogWaste() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        material: null, 
        estimatedWeight: 0.1, 
        photo: null, // Note: We handle file uploads later. Sending null for now.
    });
    const [photoName, setPhotoName] = useState('No file selected');

    const materialOptions = [
        { type: 'Plastic', icon: Package, color: 'text-blue-600', bgColor: 'bg-blue-100' },
        { type: 'Paper', icon: Feather, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
        { type: 'Metal', icon: HardHat, color: 'text-gray-600', bgColor: 'bg-gray-200' },
        { type: 'Glass', icon: GlassWater, color: 'text-green-600', bgColor: 'bg-green-100' },
        { type: 'E-Waste', icon: Zap, color: 'text-purple-600', bgColor: 'bg-purple-100' },
        { type: 'Organic', icon: Recycle, color: 'text-lime-600', bgColor: 'bg-lime-100' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: name === 'estimatedWeight' ? parseFloat(value) : value });
    };

    const handleMaterialSelect = (materialType) => {
        setFormData({ ...formData, material: materialType });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, photo: file });
        setPhotoName(file ? file.name : 'No file selected');
    };

    const handleLogWaste = async (e) => {
        e.preventDefault();
        
        if (!formData.material) {
            alert("Please select a material type before logging.");
            return;
        }

        // 1. Retrieve Citizen ID from localStorage (set during Login)
        const userInfoString = localStorage.getItem('userInfo');
        const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
        const citizenId = userInfo?._id; 
        
        if (!citizenId) {
             alert("Error: User session not found. Please log in again.");
             return navigate('/login');
        }

        try {
            const payload = {
                citizenId,
                material: formData.material,
                weight: formData.estimatedWeight,
                // photo: formData.photo // We will implement file upload logic later
            };

            // 2. Send data to the backend endpoint
            const res = await axios.post('http://localhost:5000/api/waste/log', payload);
            
            if (res.status === 201) {
                alert(`SUCCESS! ${res.data.weight} KG of ${res.data.material} logged. ID: ${res.data._id}.`);
                navigate('/home'); 
            }
        } catch (error) {
            console.error("Waste Log Error:", error.response?.data || error);
            alert(`Submission Failed: ${error.response?.data?.message || 'Server error. Check server terminal.'}`);
        }
    }; // <--- handleLogWaste is now async

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            
            {/* --- Navigation Bar (Matching Home) --- */}
            <header className="bg-white shadow-md sticky top-0 z-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 flex justify-between items-center h-16">
                    <div className="text-2xl font-bold text-[#4CAF50]">EcoCycle</div>
                    <button onClick={() => navigate('/home')} className="flex items-center space-x-2 text-gray-600 hover:text-[#4CAF50] transition">
                        <ArrowLeft className="h-5 w-5" />
                        <span className="text-sm font-medium hidden sm:inline">Back to Home</span>
                    </button>
                </div>
            </header>

            {/* --- Main Content Area --- */}
            <main className="flex-grow flex justify-center items-start py-10 px-4">
                <div 
                    className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl border-t-4 border-[#4CAF50] animate-fadeIn"
                >
                    <div className="flex items-center space-x-3 mb-8 border-b border-gray-200 pb-4">
                        <Trash2 className="h-7 w-7 text-[#4CAF50]" />
                        <h2 className="text-2xl font-bold text-gray-800">
                            Log New Recycling Item
                        </h2>
                    </div>

                    <form onSubmit={handleLogWaste} className="space-y-8">
                        
                        {/* 1. Material Selection (Visual Cards - Light Theme) */}
                        <section>
                            <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                                1. Select Material Type 
                                {formData.material && <span className="text-sm ml-3 px-3 py-1 bg-[#4CAF50]/10 text-[#4CAF50] font-bold rounded-full border border-[#4CAF50]/30 shadow-md">{formData.material}</span>}
                            </h3>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                                {materialOptions.map(({ type, icon: Icon, color, bgColor }) => (
                                    <div
                                        key={type}
                                        onClick={() => handleMaterialSelect(type)}
                                        className={`p-4 rounded-xl cursor-pointer transition-all border-2 
                                            ${formData.material === type 
                                                ? 'border-[#4CAF50] shadow-md ring-4 ring-[#4CAF50]/20' 
                                                : 'border-gray-200 hover:border-gray-400'
                                            }
                                            ${bgColor}
                                        `}
                                    >
                                        <Icon className={`h-8 w-8 ${color} mb-1`} />
                                        <p className="text-sm font-medium text-gray-800">{type}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 2. Details and Photo */}
                        <section className="pt-4 border-t border-gray-100">
                            <h3 className="text-xl font-bold text-gray-700 mb-4">
                                2. Provide Details & Photo Proof
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Estimated Weight */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2 flex items-center space-x-2">
                                        <Weight className="h-5 w-5 text-blue-600"/>
                                        <span>Estimated Weight (KG)</span>
                                    </label>
                                    <input
                                        name="estimatedWeight"
                                        type="number"
                                        step="0.1"
                                        min="0.1"
                                        value={formData.estimatedWeight}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-gray-800"
                                        placeholder="Minimum 0.1 KG"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Weight determines your EcoPoints earnings.</p>
                                </div>

                                {/* Add Photo */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2 flex items-center space-x-2">
                                        <Camera className="h-5 w-5 text-teal-600"/>
                                        <span>Photo Proof (Optional)</span>
                                    </label>
                                    <div className="flex items-center space-x-3">
                                        <label className="cursor-pointer bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition text-sm font-medium shadow-md">
                                            Select Photo
                                            <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
                                        </label>
                                        <span className="text-sm text-gray-600 truncate max-w-[150px]">{photoName}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Photo speeds up collection verification.</p>
                                </div>
                            </div>
                        </section>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                className="w-full bg-[#4CAF50] text-white font-extrabold py-4 rounded-xl 
                                           hover:bg-[#388E3C] transition-all duration-300 shadow-lg shadow-green-700/40 text-lg uppercase tracking-wider 
                                           transform hover:scale-[1.01] active:scale-[0.99] ease-in-out disabled:bg-gray-400 disabled:shadow-none"
                                disabled={!formData.material || formData.estimatedWeight < 0.1}
                            >
                                Submit Item for Collection
                            </button>
                            <p className="text-sm text-center text-gray-600 mt-3">You will receive confirmation once a Collector accepts the request.</p>
                        </div>
                    </form>
                </div>
            </main>
            
            {/* CSS for custom animation */}
            <style jsx="true">{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out;
                }
            `}</style>
        </div>
    );
}