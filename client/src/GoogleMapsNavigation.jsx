// src/GoogleMapsNavigation.js

import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const GoogleMapsNavigation = ({ location }) => {
  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={location}
        zoom={14}
      >
        <Marker position={location} />
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapsNavigation;
