import { Router } from "express";
import { UserNotifications } from "../models/notifications.js";
import { isAuthenticated } from "../middleware/auth.js";

export const notificationsRouter = Router();

// GET /api/notifications
notificationsRouter.get("/page=:page&limit=:limit", isAuthenticated, async (req, res) => {
  const userId = req.session.userId;
  const limit = req.query.limit ? +req.query.limit : 10;
  const page = req.query.page ? +req.query.page : 0;
  const userNotifications = await UserNotifications.findOne({
    user: userId,
  });
  if (!userNotifications) {
    return res.status(404).json({ error: `user ${userId} not found` });
  }
  const notifications = userNotifications.notifications;
  const notificationsPostSlice = notifications.slice(
    page * limit,
    page * limit + limit + 1
  );
  return res.json(notificationsPostSlice);
});
