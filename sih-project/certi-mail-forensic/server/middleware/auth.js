export function verifyClientKey(req, res, next) {
  const requiredKey = process.env.CLIENT_API_KEY;
  if (!requiredKey) return next(); // if unset, auth is off (dev mode)

  const providedKey = req.headers['x-client-key'];
  if (providedKey !== requiredKey) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized: missing or invalid API key' });
  }
  next();
}