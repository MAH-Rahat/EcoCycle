import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, DirectionsRenderer } from '@react-google-maps/api';
import { useLocation } from 'react-router-dom';

const containerStyle = { width: '100%', height: '450px' };

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const GoogleMapsNavigation = () => {
  const query = useQuery();
  const destinationAddress = query.get('address') || '';

  const [origin, setOrigin] = useState(null);
  const [directions, setDirections] = useState(null);
  const [error, setError] = useState('');

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported in this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setOrigin({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => setError('Location permission denied. Please allow location.')
    );
  }, []);

  useEffect(() => {
    if (!origin || !destinationAddress || !window.google) return;

    const service = new window.google.maps.DirectionsService();
    service.route(
      {
        origin,
        destination: destinationAddress,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK' && result) setDirections(result);
        else setError('Directions failed. Check address / API key restrictions.');
      }
    );
  }, [origin, destinationAddress]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Google Maps Navigation</h1>
      <p className="text-sm text-gray-600 mb-3">Destination: {destinationAddress || 'N/A'}</p>

      {!apiKey && (
        <p className="text-red-600 font-semibold">
          Missing VITE_GOOGLE_MAPS_API_KEY in client/.env
        </p>
      )}

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <LoadScript googleMapsApiKey={apiKey || ''}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={origin || { lat: 23.8103, lng: 90.4125 }} // default Dhaka
          zoom={origin ? 14 : 11}
        >
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </LoadScript>

      {destinationAddress && (
        <a
          className="inline-block mt-4 px-4 py-2 rounded bg-black text-white"
          target="_blank"
          rel="noreferrer"
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
            destinationAddress
          )}`}
        >
          Open in Google Maps
        </a>
      )}
    </div>
  );
};

export default GoogleMapsNavigation;
