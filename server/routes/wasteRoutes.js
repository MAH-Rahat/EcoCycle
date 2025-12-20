import express from 'express';
import Waste from '../models/Waste.js'; 
import User from '../models/User.js'; 

const router = express.Router();

// @desc    Log a new waste item (used by the LogWaste.jsx form)
// @route   POST /api/waste/log
router.post('/log', async (req, res) => {
    const { citizenId, material, weight, photo } = req.body; 
    
    // Simple point calculation (10 points per KG logged)
    const pointsEarned = Math.floor(weight * 10); 

    try {
        // 1. Create the new Waste Item
        const waste = await Waste.create({
            citizen: citizenId,
            material,
            weight,
            photo,
            status: 'Pending',
        });

        // 2. Update the user's total points
        await User.findByIdAndUpdate(
            citizenId,
            { $inc: { points: pointsEarned } },
            { new: true }
        );

        res.status(201).json({
            message: 'Waste item logged and points awarded successfully.',
            _id: waste._id,
            material: waste.material,
            weight: waste.weight,
            pointsAwarded: pointsEarned,
        });

    } catch (error) {
        console.error('Waste Logging Error:', error);
        res.status(500).json({ message: error.message });
    }
});


// @desc    Get user's statistics (points and item count)
// @route   GET /api/waste/stats/:id
router.get('/stats/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        // 1. Get total items logged by the user
        const totalItems = await Waste.countDocuments({ citizen: userId, status: { $ne: 'Rejected' } });

        // 2. Get user's current points
        const user = await User.findById(userId).select('points');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({
            points: user.points,
            itemsLogged: totalItems,
        });

    } catch (error) {
        console.error('Stats Fetch Error:', error);
        res.status(500).json({ message: 'Could not fetch user stats.' });
    }
});


// --- NEW ROUTE: Fetch all pending waste requests for Admin/Collector ---
// @desc    Fetch all pending waste requests
// @route   GET /api/waste/pending
// @access  Private (Admin/Collector)
router.get('/pending', async (req, res) => {
    try {
        // Fetch all waste items that are still 'Pending'
        const pendingRequests = await Waste.find({ status: 'Pending' })
            .populate('citizen', 'name email mobile') // Get citizen name/contact info
            .sort({ createdAt: -1 }); // Show newest first

        res.status(200).json(pendingRequests);
    } catch (error) {
        console.error('Fetch Pending Waste Error:', error);
        res.status(500).json({ message: 'Could not fetch pending waste requests.' });
    }
});


// --- NEW ROUTE: Update the status of a waste request ---
// @desc    Update the status and assign a collector to a waste request
// @route   PUT /api/waste/status/:id
// @access  Private (Admin/Collector)
router.put('/status/:id', async (req, res) => {
    const { status, collectorId } = req.body; // collectorId will be the ID of the Collector/Admin doing the action
    const wasteId = req.params.id;

    if (!['Accepted', 'Collected', 'Rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status provided.' });
    }

    try {
        const updateFields = {
            status,
        };

        // If the item is accepted, assign the collector
        if (status === 'Accepted' && collectorId) {
            updateFields.collector = collectorId;
        } 
        
        // Note: For 'Collected' status, we would add final reward logic here later

        const updatedWaste = await Waste.findByIdAndUpdate(
            wasteId,
            updateFields,
            { new: true, runValidators: true }
        );

        if (!updatedWaste) {
            return res.status(404).json({ message: 'Waste item not found.' });
        }

        res.status(200).json({
            message: `Waste item status updated to ${updatedWaste.status}.`,
            waste: updatedWaste,
        });

    } catch (error) {
        console.error('Waste Status Update Error:', error);
        res.status(500).json({ message: 'Could not update waste status.' });
    }
});

// --- ADDED: Route to fetch waste history for a specific user ---
// @desc    Get all waste logged by a specific user
// @route   GET /api/waste/user/:userId
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const history = await Waste.find({ citizen: userId }).sort({ createdAt: -1 });
        res.status(200).json(history);
    } catch (error) {
        console.error('Fetch User History Error:', error);
        res.status(500).json({ message: 'Could not fetch waste history.' });
    }
});

export default router;