import { Router } from 'express';
import { getSkills, adminLogin } from '../controllers/contentController.js';

const router = Router();

router.get('/skills', getSkills);
router.post('/admin/login', adminLogin);

export default router;
