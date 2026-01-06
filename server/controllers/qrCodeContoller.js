import Waste from "../models/Waste.js";
import Pickup from "../models/Pickup.js";

export const verifyQRCode = async (req, res) => {
  try {
    const { code } = req.params; // expected: wasteId

    const waste = await Waste.findById(code);
    if (!waste) {
      return res.status(404).json({ success: false, message: "Invalid QR / Waste not found." });
    }

    // Only allow verify if accepted (or already collected)
    if (!["Accepted", "Collected"].includes(waste.status)) {
      return res.status(400).json({
        success: false,
        message: `Waste status is "${waste.status}". Must be "Accepted" to verify.`,
      });
    }

    // Mark as Collected
    waste.status = "Collected";
    waste.pickupDetails = waste.pickupDetails || {};
    waste.pickupDetails.verifiedAt = new Date();
    await waste.save();

    // Update Pickup status if it exists
    await Pickup.findOneAndUpdate(
      { wasteItem: waste._id },
      { $set: { status: "Completed" } },
      { new: true }
    );

    return res.json({ success: true, wasteId: String(waste._id) });
  } catch (err) {
    console.error("QR verify error:", err);
    return res.status(500).json({ success: false, message: "Server error verifying QR." });
  }
};
