import express from 'express';
import {
  createPickup,
  getPickupsByCitizen,
  getPickupsByCollector,
  getPickupStatus,
} from '../controllers/pickupController.js';

const router = express.Router();

router.post('/schedule', createPickup);
router.get('/user/:userId', getPickupsByCitizen);
router.get('/collector/:collectorId', getPickupsByCollector);
router.get('/status', getPickupStatus);

export default router;
