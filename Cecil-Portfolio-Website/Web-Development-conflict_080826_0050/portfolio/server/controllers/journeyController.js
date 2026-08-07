import Journey from '../models/Journey.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// GET /api/journey
export const getJourney = asyncHandler(async (req, res) => {
  const steps = await Journey.find().sort({ order: 1, createdAt: 1 });
  res.json(steps);
});

// POST /api/journey (admin)
export const createStep = asyncHandler(async (req, res) => {
  const step = await Journey.create(req.body);
  res.status(201).json(step);
});

// PUT /api/journey/:id (admin)
export const updateStep = asyncHandler(async (req, res) => {
  const step = await Journey.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!step) {
    res.status(404);
    throw new Error('Journey step not found');
  }
  res.json(step);
});

// DELETE /api/journey/:id (admin)
export const deleteStep = asyncHandler(async (req, res) => {
  const step = await Journey.findByIdAndDelete(req.params.id);
  if (!step) {
    res.status(404);
    throw new Error('Journey step not found');
  }
  res.json({ message: 'Journey step deleted' });
});
