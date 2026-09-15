import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_in_production';

export function verifySessionToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized: no session token provided. Please log in.' });
  }

  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized: session expired or invalid. Please log in again.' });
  }
}

export function issueSessionToken() {
  return jwt.sign({ role: 'analyst' }, JWT_SECRET, { expiresIn: '8h' });
}