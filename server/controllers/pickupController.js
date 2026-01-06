import Pickup from "../models/Pickup.js";
import Waste from "../models/Waste.js";
import User from "../models/User.js";


/**
 * Citizen schedules a pickup
 * POST /api/pickup/schedule
 */
export const createPickup = async (req, res) => {
  try {
    const { citizen, wasteItem, address, scheduledDate, timeSlot } = req.body;

    const newPickup = new Pickup({
      citizen,
      wasteItem,
      address,
      scheduledDate,
      timeSlot,
      status: "Pending",
    });

    await newPickup.save();

    // Mark waste pickup as requested (blocks "Request Pickup" button)
    await Waste.findByIdAndUpdate(
      wasteItem,
      {
        $set: {
          "pickupDetails.isRequested": true,
          "pickupDetails.address": address,
          "pickupDetails.requestedTime": new Date(scheduledDate),
        },
      },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "Pickup scheduled successfully!",
      data: newPickup,
    });
  } catch (error) {
    console.error("Pickup Scheduling Error:", error);
    res.status(500).json({
      success: false,
      message: "Error scheduling pickup",
      error: error.message,
    });
  }
};

/**
 * Citizen sees their pickups
 * GET /api/pickup/user/:userId
 */
export const getPickupsByCitizen = async (req, res) => {
  try {
    const pickups = await Pickup.find({ citizen: req.params.userId })
      .populate("wasteItem")
      .sort({ createdAt: -1 });

    res.status(200).json(pickups);
  } catch (error) {
    console.error("Error fetching citizen pickups:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching pickups",
    });
  }
};

/**
 * Collector dashboard: pickups assigned to a collector
 * GET /api/pickup/collector/:collectorId
 *
 * NOTE: collector assignment is stored in Waste.collector (set via PUT /api/waste/status/:id)
 */
export const getPickupsByCollector = async (req, res) => {
  try {
    const { collectorId } = req.params;

    // ✅ IMPORTANT FIX:
    // Removed status restriction because many flows don't set Waste.status consistently.
    // If it's assigned to collector + requested, it should show in dashboard.
    const wastes = await Waste.find({
      collector: collectorId,
      "pickupDetails.isRequested": true,
    })
      .populate("citizen", "name email mobile")
      .sort({ updatedAt: -1 });

    // Attach pickup info (scheduledDate/timeSlot/address) from Pickup collection if exists
    const wasteIds = wastes.map((w) => w._id);
    const pickups = await Pickup.find({ wasteItem: { $in: wasteIds } }).sort({
      createdAt: -1,
    });

    const pickupMap = new Map();
    pickups.forEach((p) => pickupMap.set(String(p.wasteItem), p));

    const result = wastes.map((w) => {
      const p = pickupMap.get(String(w._id));

      // Derive display status (keeps UI consistent)
      let derivedStatus = "Assigned";
      if (w.status === "Pending") derivedStatus = "Pending";
      if (w.status === "Accepted") derivedStatus = "Assigned";
      if (w.status === "Collected") derivedStatus = "Completed";

      return {
        wasteId: w._id,
        material: w.material,
        weight: w.weight,
        wasteStatus: w.status,
        citizen: w.citizen,
        address: p?.address || w.pickupDetails?.address || "",
        scheduledDate: p?.scheduledDate || "",
        timeSlot: p?.timeSlot || "",
        pickupStatus: p?.status || derivedStatus,
        pickupId: p?._id || null,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Collector pickups fetch error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching collector pickups" });
  }
};

/**
 * Live pickup status (Citizen)
 * GET /api/pickup/status?userId=xxx OR ?pickupId=xxx
 */
export const getPickupStatus = async (req, res) => {
  try {
    const { userId, pickupId } = req.query;

    let pickup = null;

    if (pickupId) {
      pickup = await Pickup.findById(pickupId);
      if (!pickup) return res.status(404).json({ status: "Not found" });

      // Derive status from Waste if possible
      const waste = await Waste.findById(pickup.wasteItem);
      if (!waste) return res.json({ status: pickup.status });

      if (waste.status === "Pending") return res.json({ status: "Pending" });
      if (waste.status === "Accepted") return res.json({ status: "Assigned" });
      if (waste.status === "Collected") return res.json({ status: "Completed" });

      return res.json({ status: pickup.status });
    }

    if (userId) {
      // Latest pickup for the citizen
      pickup = await Pickup.findOne({ citizen: userId }).sort({ createdAt: -1 });
      if (!pickup) return res.json({ status: "No pickup yet" });

      const waste = await Waste.findById(pickup.wasteItem);
      if (!waste) return res.json({ status: pickup.status });

      if (waste.status === "Pending") return res.json({ status: "Pending" });
      if (waste.status === "Accepted") return res.json({ status: "Assigned" });
      if (waste.status === "Collected") return res.json({ status: "Completed" });

      return res.json({ status: pickup.status });
    }

    return res.status(400).json({ status: "Missing userId or pickupId" });
  } catch (error) {
    console.error("Pickup status error:", error);
    res.status(500).json({ status: "Error fetching status" });
  }
};


export const assignToFirstCollector = async (req, res) => {
  try {
    const { wasteId } = req.params;

    const collector = await User.findOne({ role: "collector" });
    if (!collector) {
      return res.status(404).json({ success: false, message: "No collector user found in DB" });
    }

    const updated = await Waste.findByIdAndUpdate(
      wasteId,
      { $set: { collector: collector._id } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Waste not found" });
    }

    return res.json({
      success: true,
      message: "Waste assigned to collector successfully",
      collectorId: collector._id,
      wasteId: updated._id,
    });
  } catch (err) {
    console.error("assignToFirstCollector error:", err);
    res.status(500).json({ success: false, message: "Assignment failed" });
  }
};

