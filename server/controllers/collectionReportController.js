import Waste from "../models/Waste.js";
import Pickup from "../models/Pickup.js";
import CollectionReport from "../models/CollectionReport.js";

export const submitCollectionReport = async (req, res) => {
  try {
    const { collectorId, wasteId, weightMeasured, notes } = req.body;

    if (!collectorId || !wasteId || weightMeasured == null) {
      return res.status(400).json({
        success: false,
        message: "collectorId, wasteId, and weightMeasured are required.",
      });
    }

    const waste = await Waste.findById(wasteId);
    if (!waste) {
      return res.status(404).json({ success: false, message: "Waste not found." });
    }

    // Create report
    const report = await CollectionReport.create({
      collector: collectorId,
      wasteItem: wasteId,
      weightMeasured: Number(weightMeasured),
      notes: notes || "",
    });

    // Update waste as collected and store measured weight
    waste.status = "Collected";
    waste.weight = Number(weightMeasured);
    waste.pickupDetails = waste.pickupDetails || {};
    waste.pickupDetails.collectedAt = new Date();
    waste.pickupDetails.collectionReportId = report._id;
    await waste.save();

    // Update pickup status if exists
    await Pickup.findOneAndUpdate(
      { wasteItem: waste._id },
      { $set: { status: "Completed" } },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "Collection report submitted successfully.",
      reportId: report._id,
    });
  } catch (err) {
    console.error("Collection report submit error:", err);
    return res.status(500).json({ success: false, message: "Server error submitting report." });
  }
};
