import express from "express";
import Waste from "../models/Waste.js";
import Pickup from "../models/Pickup.js";

const router = express.Router();

/**
 * Collection Report
 * POST /api/collection-report
 * POST /api/collection-report/submit
 *
 * body: { wasteId, weight, comments }
 *
 * Updates:
 * - Waste.weight (actual collected)
 * - Waste.status -> Collected
 * - Waste.pickupDetails.isRequested -> false (pickup cycle finished)
 * - Pickup.status -> Completed
 *
 * NOTE: no DB model for reports in your zip, so we log comments to server for now.
 */
const handleCollectionReport = async (req, res) => {
  try {
    const { wasteId, weight, comments } = req.body;

    if (!wasteId) {
      return res.status(400).json({ success: false, message: "Missing wasteId" });
    }
    if (weight == null || Number.isNaN(Number(weight)) || Number(weight) <= 0) {
      return res.status(400).json({ success: false, message: "Invalid weight" });
    }

    const waste = await Waste.findById(wasteId);
    if (!waste) {
      return res.status(404).json({ success: false, message: "Waste not found" });
    }

    // Update waste
    waste.weight = Number(weight);
    waste.status = "Collected";
    waste.pickupDetails = waste.pickupDetails || {};
    waste.pickupDetails.isRequested = false; // pickup cycle finished
    waste.pickupDetails.reportedAt = new Date();
    await waste.save();

    // Update pickup status (if exists)
    await Pickup.findOneAndUpdate(
      { wasteItem: waste._id },
      { $set: { status: "Completed" } },
      { new: true }
    );

    // No model exists, so log comments for now (still demo-friendly)
    console.log("Collection Report:", {
      wasteId,
      weight: Number(weight),
      comments: comments || "",
      at: new Date().toISOString(),
    });

    return res.json({ success: true, message: "Collection report submitted." });
  } catch (error) {
    console.error("collection-report error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Support both routes to avoid frontend mismatch headaches:
router.post("/", handleCollectionReport);
router.post("/submit", handleCollectionReport);

export default router;
