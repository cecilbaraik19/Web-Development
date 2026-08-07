export const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Not found: ${req.originalUrl}`));
};
