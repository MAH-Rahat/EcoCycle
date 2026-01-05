import User from '../models/User.js';

// Get all users with the role 'citizen'
export const getAllCitizens = async (req, res) => {
    try {
        const citizens = await User.find({ role: 'citizen' }).select('-password');
        res.json(citizens);
    } catch (error) {
        res.status(500).json({ message: "Server Error fetching citizens" });
    }
};

// Delete a citizen by ID
export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Delete failed" });
    }
};