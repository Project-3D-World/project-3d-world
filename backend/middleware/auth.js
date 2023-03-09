export const isAuthenticated = function (req, res, next) {
  if (!req.session.sub) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
};