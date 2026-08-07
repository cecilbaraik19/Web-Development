import Project from '../models/Project.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// GET /api/projects?category=&search=&page=&limit=
export const getProjects = asyncHandler(async (req, res) => {
  const { category, search, page = 1, limit = 6 } = req.query;
  const query = {};

  if (category && category !== 'All') query.category = category;
  if (search) {
    const rx = new RegExp(search.trim(), 'i');
    query.$or = [{ title: rx }, { description: rx }, { techStack: rx }];
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 6));

  const total = await Project.countDocuments(query);
  const projects = await Project.find(query)
    .sort({ createdAt: -1 })
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  res.json({ projects, total, page: pageNum, pages: Math.ceil(total / limitNum) || 1 });
});

// GET /api/projects/:id
export const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  res.json(project);
});

// POST /api/projects (admin)
export const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create(req.body);
  res.status(201).json(project);
});

// PUT /api/projects/:id (admin)
export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  res.json(project);
});

// DELETE /api/projects/:id (admin)
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  res.json({ message: 'Project deleted' });
});
