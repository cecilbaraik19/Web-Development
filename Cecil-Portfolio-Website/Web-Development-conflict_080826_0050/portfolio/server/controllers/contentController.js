import skillsData from '../utils/skillsData.js';

// GET /api/skills — static skills JSON
export const getSkills = (req, res) => {
  res.json(skillsData);
};

// POST /api/admin/login — simple secret-key check
export const adminLogin = (req, res) => {
  const { key } = req.body || {};
  if (key && process.env.ADMIN_KEY && key === process.env.ADMIN_KEY) {
    return res.json({ success: true });
  }
  res.status(401).json({ success: false, message: 'Invalid admin key' });
};
