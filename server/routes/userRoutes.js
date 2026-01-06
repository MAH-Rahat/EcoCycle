import express from 'express';
import User from '../models/User.js';
import { getAllCitizens, deleteUser } from '../controllers/userController.js';

const router = express.Router();

/**
 * GET /api/users/all-citizens
 * Admin: view all citizens
 */
router.get('/all-citizens', getAllCitizens);

/**
 * GET /api/users/collectors
 * Admin: fetch all collectors (for assignment)
 */
router.get('/collectors', async (req, res) => {
  try {
    const collectors = await User.find({ role: 'collector' })
      .select('_id name email');

    res.json(collectors);
  } catch (error) {
    console.error('Fetch collectors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * DELETE /api/users/:id
 * Admin: delete a user
 */
router.delete('/:id', deleteUser);

export default router;
