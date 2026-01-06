import mongoose from "mongoose";

const collectionReportSchema = new mongoose.Schema(
  {
    collector: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    wasteItem: { type: mongoose.Schema.Types.ObjectId, ref: "Waste", required: true },
    weightMeasured: { type: Number, required: true },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("CollectionReport", collectionReportSchema);
