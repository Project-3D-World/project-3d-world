import { Router } from "express";
import { Comments } from "../models/comments.js";
import { User } from "../models/users.js";
import { World } from "../models/worlds.js";
import mongoose from "mongoose";
export const commentsRouter = Router();

//post
commentsRouter.post("/", async (req, res) => {
  console.log(req.body);
  const author = req.body.author;
  const x = req.body.x;
  const z = req.body.z;
  const worldId = req.body.worldId;
  const content = req.body.content;
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
  const user = await User.findById(author);
  if (!user) {
    return res.status(404).json({ error: "Author not found" });
  }
  const comment = new Comments({
    author: author,
    worldId: worldId,
    chunk: {
      x: x,
      z: z,
    },
    content: content,
  });

  try {
    await comment.save();
  } catch {
    return res.status(422).json({ error: "Comment creation failed" });
  }

  return res.json(comment);
});

//get for world
commentsRouter.get(
  "/worldId=:worldId&page=:page&limit=:limit",
  async (req, res) => {
    console.log(req.params.worldId);
    const page = parseInt(req.params.page);
    const limit = parseInt(req.params.limit);
    const worldId = req.params.worldId;
    const world = await World.findById(worldId).lean();
    if (!world) {
      return res.status(404).json({ error: "World not found" });
    }
    const comments = await Comments.find({ worldId: worldId })
      .skip(page * limit)
      .limit(limit + 1);
    return res.json(comments);
  }
);
