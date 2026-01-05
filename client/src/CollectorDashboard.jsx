import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CollectorDashboard = () => {
  const [pickupRequests, setPickupRequests] = useState([]);

  useEffect(() => {
    // Fetch data from backend API
    axios.get('http://localhost:5000/api/pickups')  // Ensure your backend route is correct
      .then((response) => {
        setPickupRequests(response.data);
      })
      .catch((error) => {
        console.error('Error fetching pickup data:', error);
      });
  }, []);

  return (
    <div>
      <h1>Collector Dashboard</h1>
      <ul>
        {pickupRequests.map((request, index) => (
          <li key={index}>
            {request.wasteType} - {request.address}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CollectorDashboard;
