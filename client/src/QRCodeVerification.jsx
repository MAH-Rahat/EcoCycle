import React, { useCallback, useMemo, useState } from "react";
import * as QR from "@yudiel/react-qr-scanner";
import { useNavigate } from "react-router-dom";

export default function QRCodeVerification() {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const userInfo = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("userInfo") || "null");
    } catch {
      return null;
    }
  }, []);

  const verify = useCallback(
    async (code) => {
      if (!code || busy) return;

      setBusy(true);
      setScanResult(code);
      setMsg("Verifying QR...");

      try {
        const res = await fetch(
          `http://localhost:5000/api/qrcode/verify/${encodeURIComponent(code)}`,
          { method: "POST" }
        );
        const json = await res.json();

        if (json?.success) {
          setMsg("✅ Pickup verified!");
          localStorage.setItem("lastWasteId", json.wasteId || code);

          navigate("/collector-report", {
            state: { wasteId: json.wasteId || code },
          });
        } else {
          setMsg(json?.message || "❌ Verification failed.");
        }
      } catch (e) {
        console.error(e);
        setMsg("❌ Verification error. Check backend.");
      } finally {
        setTimeout(() => setBusy(false), 1200);
      }
    },
    [busy, navigate]
  );

  // ✅ Works with both export styles (Scanner or QrScanner)
  const ScannerComp = QR.Scanner || QR.QrScanner;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar - match your mates UI style */}
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
            Scan QR Code to Verify Pickup
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Point the camera at the QR. It will auto-detect.
          </p>

          <div className="mt-5 rounded-xl overflow-hidden border border-gray-200">
            {ScannerComp ? (
              <ScannerComp
                constraints={{ facingMode: "environment" }}
                onScan={(detectedCodes) => {
                  const raw = detectedCodes?.[0]?.rawValue;
                  if (raw) verify(raw);
                }}
                onError={(error) => console.error(error)}
              />
            ) : (
              <div className="p-4 text-red-600 text-sm">
                QR Scanner export not found. Reinstall package: npm i @yudiel/react-qr-scanner
              </div>
            )}
          </div>

          <div className="mt-4">
            {scanResult ? (
              <p className="text-sm text-gray-700">
                Scanned: <span className="font-semibold">{scanResult}</span>
              </p>
            ) : (
              <p className="text-sm text-gray-500">Waiting for scan...</p>
            )}

            {msg && <p className="text-sm mt-2 font-medium">{msg}</p>}
          </div>

          {!userInfo && (
            <div className="mt-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-sm text-yellow-800">
              You are not logged in as a collector. Please login first.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
