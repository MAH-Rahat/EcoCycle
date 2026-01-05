// src/CollectionReport.js

import React, { useState } from 'react';

const CollectionReport = () => {
  const [weight, setWeight] = useState('');
  const [comments, setComments] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const reportData = { weight, comments };

    fetch('http://localhost:5000/api/collection-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportData),
    })
      .then((response) => response.json())
      .then((data) => {
        alert('Report submitted successfully!');
      })
      .catch((error) => {
        console.error('Error submitting report:', error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Weight Collected (kg):</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Comments:</label>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
      </div>
      <button type="submit">Submit Report</button>
    </form>
  );
};

export default CollectionReport;
