import { Router } from 'express';
import {
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
} from '../controllers/certificationController.js';
import { adminAuth } from '../middlewares/adminAuth.js';

const router = Router();

router.route('/').get(getCertifications).post(adminAuth, createCertification);
router.route('/:id').put(adminAuth, updateCertification).delete(adminAuth, deleteCertification);

export default router;
