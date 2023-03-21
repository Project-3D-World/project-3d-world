export const isAuthenticated = function (req, res, next) {
  next();
};

export const isWsAuthenticated = function (ws, req, next) {
  if (!req.session.sub) {
    return ws.close(4011, "Not authenticated");
  }
  next();
};
