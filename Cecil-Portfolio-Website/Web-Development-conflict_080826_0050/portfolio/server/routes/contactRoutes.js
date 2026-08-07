import { Router } from 'express';
import {
  createMessage,
  getMessages,
  markRead,
  deleteMessage,
} from '../controllers/contactController.js';
import { adminAuth } from '../middlewares/adminAuth.js';

const router = Router();

router.route('/').post(createMessage).get(adminAuth, getMessages);
router.route('/:id').delete(adminAuth, deleteMessage);
router.route('/:id/read').put(adminAuth, markRead);

export default router;
