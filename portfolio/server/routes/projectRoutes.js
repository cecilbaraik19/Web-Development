import { Router } from 'express';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { adminAuth } from '../middlewares/adminAuth.js';

const router = Router();

router.route('/').get(getProjects).post(adminAuth, createProject);
router.route('/:id').get(getProject).put(adminAuth, updateProject).delete(adminAuth, deleteProject);

export default router;
