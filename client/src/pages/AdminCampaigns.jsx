import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Megaphone, Send, Trash2, Info, Calendar, Newspaper } from 'lucide-react';

export default function AdminCampaigns() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'News',
        imageUrl: ''
    });

    // Fetch existing posts to show the Admin what is already live
    const fetchPosts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/campaigns');
            setPosts(res.data);
        } catch (error) {
            console.error("Failed to fetch posts", error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/campaigns', formData);
            alert("Campaign posted successfully!");
            setFormData({ title: '', content: '', category: 'News', imageUrl: '' });
            fetchPosts(); // Refresh list
        } catch (error) {
            alert("Error posting campaign");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <button 
                    onClick={() => navigate('/admin-dashboard')} 
                    className="flex items-center text-gray-500 hover:text-black mb-6 font-semibold transition"
                >
                    <ArrowLeft className="mr-2 h-5 w-5" /> Back to Dashboard
                </button>

                <div className="bg-white rounded-3xl shadow-xl p-8 mb-10 border border-gray-100">
                    <h2 className="text-3xl font-black text-gray-800 mb-6 flex items-center gap-3">
                        <Megaphone className="text-orange-500 h-8 w-8" />
                        Create Awareness Campaign
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Campaign Title</label>
                                <input 
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition"
                                    placeholder="e.g. Sunday Beach Cleanup"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                                <select 
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition cursor-pointer"
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                >
                                    <option value="News">News</option>
                                    <option value="Recycling Fact">Recycling Fact</option>
                                    <option value="Event">Event</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Image URL (Optional)</label>
                            <input 
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition"
                                placeholder="Paste image link here..."
                                value={formData.imageUrl}
                                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Content Details</label>
                            <textarea 
                                required
                                rows="4"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition"
                                placeholder="Share the facts or news details here..."
                                value={formData.content}
                                onChange={(e) => setFormData({...formData, content: e.target.value})}
                            ></textarea>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-orange-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-100 hover:bg-orange-600 transition flex items-center justify-center gap-2"
                        >
                            {loading ? "Publishing..." : <><Send className="h-5 w-5"/> Publish Campaign</>}
                        </button>
                    </form>
                </div>

                {/* --- List of Existing Campaigns --- */}
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Recent Campaigns</h3>
                <div className="space-y-4">
                    {posts.map(post => (
                        <div key={post._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-orange-50 rounded-xl">
                                    {post.category === 'Event' ? <Calendar className="text-orange-600"/> : 
                                     post.category === 'News' ? <Newspaper className="text-orange-600"/> : 
                                     <Info className="text-orange-600"/>}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800">{post.title}</h4>
                                    <p className="text-xs text-gray-400 font-bold uppercase">{post.category} • {new Date(post.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}