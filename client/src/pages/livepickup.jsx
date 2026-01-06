import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, Clock, CheckCircle2, Truck, AlertCircle } from "lucide-react";

export default function LivePickupStatus() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("userInfo") || "null");
    } catch {
      return null;
    }
  }, []);

  const userId = user?._id;

  const fetchStatus = async () => {
    if (!userId) {
      setErr("User not logged in. Please login again.");
      setLoading(false);
      return;
    }

    setErr("");
    try {
      const res = await axios.get(`http://localhost:5000/api/pickup/status?userId=${userId}`);
      setStatus(res.data?.status || "Unknown");
    } catch (e) {
      console.error("Live pickup status error:", e);
      setErr(e.response?.data?.status || "Failed to fetch pickup status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const t = setInterval(fetchStatus, 5000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const badge = () => {
    const s = (status || "").toLowerCase();
    if (s.includes("no pickup")) return { icon: AlertCircle, cls: "bg-gray-100 text-gray-700 border-gray-200" };
    if (s.includes("pending")) return { icon: Clock, cls: "bg-yellow-50 text-yellow-800 border-yellow-200" };
    if (s.includes("assigned")) return { icon: Truck, cls: "bg-blue-50 text-blue-800 border-blue-200" };
    if (s.includes("completed") || s.includes("collected"))
      return { icon: CheckCircle2, cls: "bg-green-50 text-green-800 border-green-200" };
    return { icon: AlertCircle, cls: "bg-gray-100 text-gray-700 border-gray-200" };
  };

  const BIcon = badge().icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar like your mates UI */}
      <header className="bg-white shadow-md sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex justify-between items-center h-16">
          <div className="text-2xl font-bold text-[#4CAF50]">EcoCycle</div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/home")}
              className="flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <button
              onClick={fetchStatus}
              className="flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-lg bg-gray-900 text-white hover:bg-black"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-2xl shadow-xl border-t-4 border-[#4CAF50] p-5 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Live Pickup Status</h1>
          <p className="text-sm text-gray-600 mt-1">This updates automatically every 5 seconds.</p>

          {!userId && (
            <div className="mt-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-sm text-yellow-800">
              You are not logged in. Go to Login.
            </div>
          )}

          {err && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {err}
            </div>
          )}

          <div className="mt-5">
            {loading ? (
              <p className="text-gray-500">Fetching status...</p>
            ) : (
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${badge().cls}`}>
                <BIcon className="h-5 w-5" />
                <span className="font-bold">{status || "Unknown"}</span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
