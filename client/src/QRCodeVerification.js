// src/QRCodeVerification.js

import React, { useState } from 'react';
import ReactQrReader from 'react-qr-reader';

const QRCodeVerification = () => {
  const [scanResult, setScanResult] = useState('');

  const handleScan = (data) => {
    if (data) {
      setScanResult(data);
      // Call backend API to verify pickup
      verifyQRCode(data);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const verifyQRCode = (code) => {
    fetch(`http://localhost:5000/api/verify/${code}`, { method: 'POST' })  // Backend API
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert('Pickup verified successfully!');
        } else {
          alert('Verification failed.');
        }
      })
      .catch((error) => console.error('Error verifying QR code:', error));
  };

  return (
    <div>
      <h1>Scan QR Code to Verify Pickup</h1>
      <ReactQrReader
        delay={300}
        style={{ width: '100%' }}
        onError={handleError}
        onScan={handleScan}
      />
      {scanResult && <p>Scan Result: {scanResult}</p>}
    </div>
  );
};

export default QRCodeVerification;
