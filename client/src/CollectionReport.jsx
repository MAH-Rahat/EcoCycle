import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function CollectionReport() {
  const navigate = useNavigate();
  const location = useLocation();

  const userInfo = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("userInfo") || "null");
    } catch {
      return null;
    }
  }, []);

  const initialWasteId = location?.state?.wasteId || localStorage.getItem("lastWasteId") || "";

  const [wasteId, setWasteId] = useState(initialWasteId);
  const [weightMeasured, setWeightMeasured] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (!userInfo?._id) {
      alert("Collector session not found. Please login again.");
      return navigate("/login");
    }
    if (!wasteId || !weightMeasured) {
      alert("Please provide Waste ID and measured weight.");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("http://localhost:5000/api/collection-report/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collectorId: userInfo._id,
          wasteId,
          weightMeasured: Number(weightMeasured),
          notes,
        }),
      });

      const json = await res.json();
      if (json?.success) {
        alert("✅ Report submitted!");
        localStorage.removeItem("lastWasteId");
        navigate("/collector-dashboard");
      } else {
        alert(json?.message || "❌ Failed to submit report.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server error submitting report.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex justify-between items-center h-16">
          <div className="text-2xl font-bold text-[#4CAF50]">EcoCycle</div>
          <button
            onClick={() => navigate("/collector-dashboard")}
            className="text-sm font-semibold px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-2xl shadow-xl border-t-4 border-[#4CAF50] p-5 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Collection Report
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Fill this after verifying the pickup QR.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Waste ID
              </label>
              <input
                value={wasteId}
                onChange={(e) => setWasteId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50]"
                placeholder="Paste scanned wasteId here"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Measured Weight (KG)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={weightMeasured}
                onChange={(e) => setWeightMeasured(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50]"
                placeholder="e.g., 0.5"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50]"
                rows={4}
                placeholder="Condition, issues, remarks..."
              />
            </div>

            <button
              disabled={busy}
              className="w-full bg-[#4CAF50] text-white font-extrabold py-3 rounded-xl hover:bg-[#388E3C] transition disabled:bg-gray-400"
            >
              {busy ? "Submitting..." : "Submit Report"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
