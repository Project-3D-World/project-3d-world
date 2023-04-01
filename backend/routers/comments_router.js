import { Router } from "express";
import { Comments } from "../models/comments.js";
import { User } from "../models/users.js";
import { World } from "../models/worlds.js";
import { UserNotifications } from "../models/notifications.js";
import { isAuthenticated } from "../middleware/auth.js";
import mongoose from "mongoose";
import { usersRouter } from "./users_router.js";
import { sendNotification } from "../socketio/notifications.js";

export const commentsRouter = Router();

//post
commentsRouter.post("/", isAuthenticated, async (req, res) => {
  const author = req.body.author;
  const x = req.body.x;
  const z = req.body.z;
  const worldId = req.body.worldId;
  const content = req.body.content;
  const rating = req.body.rating;
  if (!mongoose.Types.ObjectId.isValid(author)) {
    return res.status(422).json({ error: "Invalid id" });
  }
  if (!mongoose.Types.ObjectId.isValid(worldId)) {
    return res.status(422).json({ error: "Invalid id" });
  }
  const world = await World.findById(worldId).lean();
  if (!world) {
    return res.status(404).json({ error: "World not found" });
  }
  const chunk = world.chunks.find((chunk) => {
    return chunk.x === x && chunk.z === z;
  });
  if (!chunk) {
    return res.status(404).json({ error: "Chunk not found" });
  }
  if (chunk.claimedBy === null) {
    return res.status(422).json({ error: "Chunk not claimed" });
  }

  const user = await User.findById(author);
  if (!user) {
    return res.status(404).json({ error: "Author not found" });
  }
  const ogComment = await Comments.findOne({
    author: author,
    "chunk.x": x,
    "chunk.z": z,
    worldId: worldId,
  });
  if (ogComment) {
    return res.status(422).json({ error: "You already rated this chunk" });
  }
  const comment = new Comments({
    author: author,
    worldId: worldId,
    chunk: {
      x: x,
      z: z,
    },
    content: content,
    rating: rating,
  });

  const newNotification = {
    sender: user.displayName,
    rating: rating,
    chunk: {
      x, z
    },
    worldId: worldId,
  }
  const userNotifications = await UserNotifications.findOne({
    userId: chunk.claimedBy,
  });
  userNotifications.notifications.unshift(newNotification);

  try {
    await comment.save();
    await userNotifications.save();
  } catch {
    return res.status(422).json({ error: "Comment creation failed" });
  }

  const receiver = chunk.claimedBy.toString();
  sendNotification(receiver, newNotification);
  return res.json(comment);
});

//get for world
commentsRouter.get(
  "/worldId=:worldId&x=:x&z=:z&page=:page&limit=:limit",
  isAuthenticated,
  async (req, res) => {
    console.log(req.params.worldId);
    const page = parseInt(req.params.page);
    const limit = parseInt(req.params.limit);
    const worldId = req.params.worldId;
    const x = parseInt(req.params.x);
    const z = parseInt(req.params.z);
    const world = await World.findById(worldId).lean();
    if (!world) {
      return res.status(404).json({ error: "World not found" });
    }
    const comments = await Comments.find({
      worldId: worldId,
      "chunk.x": x,
      "chunk.z": z,
    })
      .populate("author")
      .sort({ createdAt: "desc" })
      .skip(page * limit)
      .limit(limit + 1);
    return res.json(comments);
  }
);

commentsRouter.delete("/:id", isAuthenticated, async (req, res) => {
  const id = req.params.id;

  const comment = await Comments.findById(id);
  if (!comment) {
    return res.status(404).json({ error: "Comment not found" });
  }
  if (comment.author.toString() !== req.session.userId) {
    return res.status(401).json({ error: "Unauthorized to delete comment" });
  }
  try {
    await Comments.findByIdAndDelete(id);
  } catch {
    return res.status(422).json({ error: "Comment deletion failed" });
  }

  return res.json(comment);
});
