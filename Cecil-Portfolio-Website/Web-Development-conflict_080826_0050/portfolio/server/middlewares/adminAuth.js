// Protects admin-only routes. The client sends the key as an `x-admin-key` header.
export const adminAuth = (req, res, next) => {
  const key = req.headers['x-admin-key'];
  if (!process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ message: 'Unauthorized: invalid or missing admin key' });
  }
  next();
};
