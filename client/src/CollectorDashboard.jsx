import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  QrCode,
  FileText,
  RefreshCw,
  Search,
  Truck,
  User,
  Package,
} from "lucide-react";

export default function CollectorDashboard() {
  const navigate = useNavigate();

  // Logged-in user
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("userInfo") || "null");
    } catch {
      return null;
    }
  }, []);

  const collectorId = user?._id;

  const [pickupRequests, setPickupRequests] = useState([]);
  const [areaFilter, setAreaFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  // ✅ Guard: only collector should be here
  useEffect(() => {
    if (!user) return;
    if (user.role !== "collector") navigate("/login");
  }, [user, navigate]);

  const fetchPickups = async (silent = false) => {
    if (!collectorId) return;

    if (!silent) setRefreshing(true);
    setErrMsg("");

    try {
      const res = await axios.get(
        `http://localhost:5000/api/pickup/collector/${collectorId}`
      );
      setPickupRequests(res.data || []);
    } catch (err) {
      console.error("Error fetching collector pickups:", err);
      setErrMsg("Failed to load pickup requests. Check server terminal.");
    } finally {
      setLoading(false);
      if (!silent) setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!collectorId) {
      setLoading(false);
      return;
    }

    fetchPickups(true);
    const interval = setInterval(() => fetchPickups(true), 8000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectorId]);

  const filtered = useMemo(() => {
    const q = areaFilter.trim().toLowerCase();
    if (!q) return pickupRequests;
    return pickupRequests.filter((p) =>
      (p.address || "").toLowerCase().includes(q)
    );
  }, [pickupRequests, areaFilter]);

  const statusPill = (status) => {
    const s = (status || "Assigned").toLowerCase();
    if (s.includes("completed"))
      return "bg-green-100 text-green-700 border-green-200";
    if (s.includes("assigned"))
      return "bg-blue-100 text-blue-700 border-blue-200";
    if (s.includes("pending"))
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow p-6 w-full max-w-md">
          <p className="font-semibold text-gray-800">Please login first.</p>
          <button
            className="mt-4 w-full px-4 py-2 rounded bg-gray-900 text-white hover:bg-black transition"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar (mates style) */}
      <header className="bg-white shadow-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex justify-between items-center h-16">
          <div className="text-2xl font-bold text-[#4CAF50]">EcoCycle</div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/collector-scan")}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900 text-white hover:bg-black transition text-sm"
            >
              <QrCode className="h-4 w-4" />
              Scan QR
            </button>

            <button
              onClick={() => navigate("/livepickup")}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition text-sm"
            >
              <Truck className="h-4 w-4" />
              Live Pickup
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow border-t-4 border-[#4CAF50] p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                Collector Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Assigned pickups will appear here once citizens request pickup and admin accepts.
              </p>
            </div>

            <button
              onClick={() => fetchPickups(false)}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition text-sm font-semibold"
              disabled={refreshing}
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {/* Filter */}
          <div className="mt-5">
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white">
              <Search className="h-4 w-4 text-gray-500" />
              <input
                className="w-full outline-none text-sm"
                placeholder="Filter by area / address..."
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value)}
              />
            </div>
          </div>

          {/* Errors */}
          {errMsg && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {errMsg}
            </div>
          )}

          {/* Content */}
          <div className="mt-6">
            {loading ? (
              <p className="text-gray-600 text-sm">Loading pickups...</p>
            ) : filtered.length === 0 ? (
              <div className="p-4 rounded-xl bg-gray-50 border text-sm text-gray-600">
                No assigned pickup requests found.
                <div className="mt-2 text-xs text-gray-500">
                  Tip: Citizen must request pickup → Admin accepts → Collector sees it here.
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filtered.map((p) => (
                  <div
                    key={p.wasteId}
                    className="bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="text-base font-bold text-gray-900 flex items-center gap-2">
                            <Package className="h-4 w-4 text-[#4CAF50]" />
                            {p.material || "Unknown"} — {p.weight ?? "?"} kg
                          </div>

                          <span
                            className={`text-xs px-2 py-1 rounded-full border font-semibold ${statusPill(
                              p.pickupStatus
                            )}`}
                          >
                            {p.pickupStatus || "Assigned"}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-gray-700 flex items-start gap-2">
                          <MapPin className="h-4 w-4 mt-[2px] text-gray-500" />
                          <span className="leading-5">
                            {p.address || "Address not provided"}
                          </span>
                        </p>

                        {p.scheduledDate && (
                          <p className="mt-1 text-sm text-gray-600">
                            Schedule: {p.scheduledDate} {p.timeSlot ? `(${p.timeSlot})` : ""}
                          </p>
                        )}

                        {p.citizen?.name && (
                          <p className="mt-2 text-sm text-gray-700 flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            {p.citizen.name}{" "}
                            <span className="text-gray-500">
                              ({p.citizen.mobile || "no mobile"})
                            </span>
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 min-w-[160px]">
                        <button
                          className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-black text-white text-sm hover:bg-gray-900 transition disabled:opacity-50"
                          onClick={() =>
                            navigate(
                              `/collector-maps?address=${encodeURIComponent(p.address || "")}`
                            )
                          }
                          disabled={!p.address}
                          title={!p.address ? "No address provided" : "Open navigation"}
                        >
                          <MapPin className="h-4 w-4" />
                          Navigate
                        </button>

                        <button
                          className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-sm hover:bg-gray-200 transition"
                          onClick={() => navigate("/collector-scan")}
                        >
                          <QrCode className="h-4 w-4" />
                          Verify QR
                        </button>

                        <button
                          className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#4CAF50] text-white text-sm hover:bg-[#388E3C] transition"
                          onClick={() => {
                            localStorage.setItem("lastWasteId", p.wasteId);
                            navigate("/collector-report", { state: { wasteId: p.wasteId } });
                          }}
                        >
                          <FileText className="h-4 w-4" />
                          Submit Report
                        </button>
                      </div>
                    </div>

                    {/* Helpful footer */}
                    <div className="mt-3 text-xs text-gray-500">
                      Waste ID: <span className="font-mono">{p.wasteId}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
