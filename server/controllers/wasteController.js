import Waste from '../models/Waste.js';
import User from '../models/User.js';

/**
 * Log waste (Citizen)
 */
export const logWaste = async (req, res) => {
  try {
    const { citizenId, material, weight, photo } = req.body;

    const newWaste = new Waste({
      citizen: citizenId,
      material,
      weight,
      photo: photo || null,
      status: 'Pending',
      pickupDetails: { isRequested: false },
    });

    await newWaste.save();
    res.status(201).json(newWaste);
  } catch (error) {
    console.error('Waste Log Error:', error);
    res.status(500).json({ message: 'Server error while logging waste.', error: error.message });
  }
};

/**
 * Fetch pending waste (Admin)
 */
export const getPendingWastes = async (req, res) => {
  try {
    const wastes = await Waste.find({ status: 'Pending' }).populate('citizen', 'name email');
    res.json(wastes);
  } catch (error) {
    console.error('Fetch Pending Waste Error:', error);
    res.status(500).json({ message: 'Server error while fetching pending waste.' });
  }
};

/**
 * Fetch citizen waste logs
 */
export const getWastesByCitizen = async (req, res) => {
  try {
    const wastes = await Waste.find({ citizen: req.params.userId }).sort({ createdAt: -1 });
    res.json(wastes);
  } catch (error) {
    console.error('Fetch Citizen Waste Error:', error);
    res.status(500).json({ message: 'Server error while fetching user waste logs.' });
  }
};

/**
 * Update waste status (Admin)
 * PUT /api/waste/status/:id
 *
 * IMPORTANT:
 * - If Accepted and collectorId not provided -> auto-assign first collector user.
 */
export const updateWasteStatus = async (req, res) => {
  try {
    const { status, collectorId } = req.body;
    const { id } = req.params;

    const allowed = ['Pending', 'Accepted', 'Rejected', 'Collected'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const waste = await Waste.findById(id);
    if (!waste) return res.status(404).json({ message: 'Waste not found.' });

    // If admin accepts, assign a real collector (not admin)
    if (status === 'Accepted') {
      let assignedCollectorId = collectorId;

      if (!assignedCollectorId) {
        const firstCollector = await User.findOne({ role: 'collector' }).select('_id');
        if (!firstCollector) {
          return res.status(400).json({
            message: 'No collector users found. Create a collector account first.',
          });
        }
        assignedCollectorId = firstCollector._id;
      }

      waste.status = 'Accepted';
      waste.collector = assignedCollectorId;

      // keep request false until citizen requests pickup
      waste.pickupDetails = waste.pickupDetails || {};
      waste.pickupDetails.isRequested = false;

      await waste.save();
      return res.json({ message: 'Waste accepted and collector assigned.', waste });
    }

    // If rejected, clear collector & pickup request
    if (status === 'Rejected') {
      waste.status = 'Rejected';
      waste.collector = null;
      waste.pickupDetails = waste.pickupDetails || {};
      waste.pickupDetails.isRequested = false;
      await waste.save();
      return res.json({ message: 'Waste rejected.', waste });
    }

    // Collected
    if (status === 'Collected') {
      waste.status = 'Collected';
      await waste.save();
      return res.json({ message: 'Waste marked as collected.', waste });
    }

    // Pending (reset)
    waste.status = 'Pending';
    waste.collector = null;
    waste.pickupDetails = waste.pickupDetails || {};
    waste.pickupDetails.isRequested = false;
    await waste.save();
    return res.json({ message: 'Waste reset to pending.', waste });
  } catch (error) {
    console.error('Update Waste Status Error:', error);
    res.status(500).json({ message: 'Server error while updating waste status.' });
  }
};
