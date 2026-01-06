import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Package,
  Trash2,
  ArrowLeft,
  Loader2,
  Clock,
  Camera,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  Users,
} from "lucide-react";

export default function AdminWasteManager() {
  const navigate = useNavigate();
  const [wasteData, setWasteData] = useState([]);
  const [collectors, setCollectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMaterial, setSelectedMaterial] = useState("All");
  const [error, setError] = useState(null);
  const [adminId, setAdminId] = useState(null);

  const materialTypes = ["All", "Plastic", "Paper", "Metal", "Glass", "E-Waste", "Organic"];

  const handleFetchWaste = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:5000/api/waste/pending");
      setWasteData(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load waste requests. Check server terminal for crash details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCollectors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/collectors");
      setCollectors(res.data || []);
    } catch (err) {
      console.error("Collector fetch error:", err);
      setCollectors([]);
    }
  };

  useEffect(() => {
    const userInfoString = localStorage.getItem("userInfo");
    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

    if (!userInfo || userInfo.role !== "admin") {
      navigate("/login");
      return;
    }

    setAdminId(userInfo._id);
    handleFetchWaste();
    fetchCollectors();
  }, [navigate]);

  const handleAction = async (id, action, chosenCollectorId) => {
    if (!adminId) {
      alert("Error: Admin session required to perform action.");
      return;
    }

    if (action === "Accepted" && !chosenCollectorId) {
      alert("Please select a collector before accepting.");
      return;
    }

    const confirmMsg =
      action === "Accepted"
        ? "Accept and assign to this collector?"
        : `Are you sure you want to ${action.toLowerCase()} this request?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      const payload = {
        status: action,
        collectorId: action === "Accepted" ? chosenCollectorId : undefined,
      };

      const res = await axios.put(`http://localhost:5000/api/waste/status/${id}`, payload);

      if (res.status === 200) {
        setWasteData((prev) => prev.filter((item) => item._id !== id));
        alert(`Request successfully marked as ${action}.`);
      }
    } catch (err) {
      console.error(`Action failed for ${id}:`, err);
      alert(`Failed: ${err.response?.data?.message || "Server error."}`);
    }
  };

  const filteredData = wasteData.filter(
    (item) => selectedMaterial === "All" || item.material === selectedMaterial
  );

  const WasteCard = ({ item }) => {
    const [selectedCollector, setSelectedCollector] = useState("");

    return (
      <div className="bg-white p-4 rounded-lg shadow border border-gray-100 flex flex-col space-y-3">
        <div className="flex justify-between items-center border-b pb-2">
          <span
            className={`text-sm font-bold px-3 py-1 rounded-full text-white ${
              item.material === "Plastic"
                ? "bg-blue-500"
                : item.material === "Paper"
                ? "bg-yellow-600"
                : item.material === "Metal"
                ? "bg-gray-500"
                : item.material === "Glass"
                ? "bg-green-500"
                : "bg-purple-500"
            }`}
          >
            {item.material}
          </span>
          <span className="text-sm text-gray-500 flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
          </span>
        </div>

        <div className="flex space-x-4">
          <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
            {item.photo ? (
              <img src={item.photo} alt={`${item.material} waste`} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <Camera className="h-5 w-5 text-gray-500" />
            )}
          </div>

          <div className="flex-grow">
            <p className="text-lg font-bold text-gray-800 flex items-center space-x-1">
              <Package className="h-4 w-4 text-green-600" />
              <span>{item.weight} KG</span>
            </p>

            <p className="text-sm text-gray-600 flex items-center space-x-1">
              <User className="h-4 w-4 text-indigo-600" />
              <span>{item.citizen?.name || "Citizen"} ({item.citizen?.email || "N/A"})</span>
            </p>

            <p className="text-xs text-gray-500 flex items-center space-x-1 mt-1">
              <MapPin className="h-3 w-3" />
              <span>{item.pickupDetails?.address || "Address Not Specified"}</span>
            </p>
          </div>
        </div>

        {/* Collector assignment */}
        <div className="bg-gray-50 border rounded-lg p-3">
          <p className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-gray-600" />
            Assign Collector
          </p>

          <select
            value={selectedCollector}
            onChange={(e) => setSelectedCollector(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
          >
            <option value="">-- Select Collector --</option>
            {collectors.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} ({c.email})
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-2 border-t border-gray-100">
          <button
            onClick={() => handleAction(item._id, "Accepted", selectedCollector)}
            className="flex items-center space-x-1 text-sm bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Accept</span>
          </button>

          <button
            onClick={() => handleAction(item._id, "Rejected")}
            className="flex items-center space-x-1 text-sm bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
          >
            <XCircle className="h-4 w-4" />
            <span>Reject</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-800 shadow-xl">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center h-16">
          <div className="text-2xl font-bold text-white flex items-center space-x-2">
            <Trash2 className="h-6 w-6 text-yellow-500" />
            <span>Waste Management</span>
          </div>
          <button
            onClick={() => navigate("/admin-panel")}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-8 px-4">
        <div className="mb-6 p-4 bg-white rounded-xl shadow-lg border-l-4 border-indigo-600">
          <h1 className="text-2xl font-bold text-gray-800">Pending Requests ({filteredData.length})</h1>
          <p className="text-sm text-gray-500">Accept and assign a collector.</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6 p-3 bg-white rounded-xl shadow-md">
          {materialTypes.map((material) => (
            <button
              key={material}
              onClick={() => setSelectedMaterial(material)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                ${
                  selectedMaterial === material
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              {material}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500 flex items-center justify-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading requests...</span>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-600 bg-red-100 p-4 rounded-lg">{error}</div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-white p-6 rounded-lg shadow">
            No pending {selectedMaterial === "All" ? "" : selectedMaterial} requests found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((item) => (
              <WasteCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
