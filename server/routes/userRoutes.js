import express from 'express';
import { getAllCitizens, deleteUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/all-citizens', getAllCitizens);
router.delete('/:id', deleteUser);

export default router;