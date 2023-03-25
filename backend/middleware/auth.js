export const isAuthenticated = function (req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
};

export const isWsAuthenticated = function (ws, req, next) {
  if (!req.session.sub) {
    return ws.close(4011, "Not authenticated");
  }
  next();
};
