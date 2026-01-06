import express from "express";
import Waste from "../models/Waste.js";
import Pickup from "../models/Pickup.js";

const router = express.Router();

/**
 * QR Verify
 * POST /api/qrcode/verify/:code
 *
 * Treat "code" as wasteId (simple + consistent).
 *
 * Safer behavior:
 * - Only allow verify if waste.status is Accepted (or already Collected)
 * - Optionally ensure pickup was requested (pickupDetails.isRequested === true)
 * - Mark Waste.status -> Collected
 * - Mark Pickup.status -> Completed (if pickup exists)
 */
router.post("/verify/:code", async (req, res) => {
  try {
    const { code } = req.params; // wasteId

    const waste = await Waste.findById(code);
    if (!waste) {
      return res.status(404).json({ success: false, message: "Invalid QR (waste not found)" });
    }

    // If already collected
    if (waste.status === "Collected") {
      return res.status(400).json({ success: false, message: "Already collected" });
    }

    // Gate: must be Accepted first (admin accepted)
    if (waste.status !== "Accepted") {
      return res.status(400).json({
        success: false,
        message: `Cannot verify. Current waste status is "${waste.status}". Must be "Accepted" first.`,
      });
    }

    // Gate: ensure citizen requested pickup (optional but makes sense)
    if (!waste?.pickupDetails?.isRequested) {
      return res.status(400).json({
        success: false,
        message: "Pickup request not found for this waste yet.",
      });
    }

    // Mark waste collected
    waste.status = "Collected";
    waste.pickupDetails = waste.pickupDetails || {};
    waste.pickupDetails.collectedAt = new Date();
    await waste.save();

    // Mark related pickup completed (if exists)
    await Pickup.findOneAndUpdate(
      { wasteItem: waste._id },
      { $set: { status: "Completed" } },
      { new: true }
    );

    return res.json({ success: true, wasteId: String(waste._id) });
  } catch (error) {
    console.error("QR verify error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
