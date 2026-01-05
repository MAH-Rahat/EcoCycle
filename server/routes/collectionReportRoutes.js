// server/routes/collectionReportRoutes.js

import express from 'express';
const router = express.Router();

// POST route for collection report submission
router.post('/', (req, res) => {
  const { weight, comments } = req.body;

  // Here you can save this data to a database or process it
  console.log(`Weight: ${weight}, Comments: ${comments}`);

  // Respond with success
  res.json({ success: true });
});

export default router;
