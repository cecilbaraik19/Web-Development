import Certification from '../models/Certification.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// GET /api/certifications
export const getCertifications = asyncHandler(async (req, res) => {
  const certifications = await Certification.find().sort({ order: 1, createdAt: -1 });
  res.json(certifications);
});

// POST /api/certifications (admin)
export const createCertification = asyncHandler(async (req, res) => {
  const certification = await Certification.create(req.body);
  res.status(201).json(certification);
});

// PUT /api/certifications/:id (admin)
export const updateCertification = asyncHandler(async (req, res) => {
  const certification = await Certification.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!certification) {
    res.status(404);
    throw new Error('Certification not found');
  }
  res.json(certification);
});

// DELETE /api/certifications/:id (admin)
export const deleteCertification = asyncHandler(async (req, res) => {
  const certification = await Certification.findByIdAndDelete(req.params.id);
  if (!certification) {
    res.status(404);
    throw new Error('Certification not found');
  }
  res.json({ message: 'Certification deleted' });
});
