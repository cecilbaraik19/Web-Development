import { Router } from 'express';
import {
  getJourney,
  createStep,
  updateStep,
  deleteStep,
} from '../controllers/journeyController.js';
import { adminAuth } from '../middlewares/adminAuth.js';

const router = Router();

router.route('/').get(getJourney).post(adminAuth, createStep);
router.route('/:id').put(adminAuth, updateStep).delete(adminAuth, deleteStep);

export default router;
