import { Router } from "express";
import mongoose from "mongoose";

import { getGfs } from "../datasource.js";
import { World } from "../models/worlds.js";
// import { User } from "../models/users.js";

const gfs = getGfs();

// TODO: add user authentication middleware

export const worldsRouter = Router();

/* GET /api/worlds */
worldsRouter.get("/", async (req, res) => {
  const worlds = await World.find().lean();
  res.json({ worlds });
});

/* GET /api/worlds/:id/map */
worldsRouter.get("/:id/map", async (req, res) => {});

/* POST /api/worlds */
worldsRouter.post("/", async (req, res) => {
  /* req.body should be:
  {
    name: string,
    chunkSize: { x: number, y: number, z: number },
    description: string,
    rules: string,
    chunks: [{ x: number, z: number }]
  } 
  */
  if (
    !req.body.name ||
    !req.body.chunkSize ||
    !req.body.description ||
    !req.body.rules ||
    !req.body.chunks
  ) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  const chunkSize = req.body.chunkSize;
  if (chunkSize.x <= 0 || chunkSize.y <= 0 || chunkSize.z <= 0) {
    res.status(400).json({ error: "Invalid chunk size" });
    return;
  }
  if (req.body.chunks === 0) {
    res.status(400).json({ error: "No chunks provided" });
    return;
  }
  const chunks = req.body.chunks.map((c) => {
    return { location: { x: c.x, z: c.z } };
  });

  const world = new World({
    name: req.body.name,
    chunkSize: req.body.chunkSize,
    description: req.body.description,
    rules: req.body.rules,
    chunks,
  });

  try {
    await world.save();
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).json({ error: err.message });
      return;
    }
  }
  res.json(world);
});

/* PATCH /api/worlds/:worldId/chunks/:chunkId */
worldsRouter.patch("/:worldId/chunks/:chunkId", async (req, res) => {
  /* an endpoint for a user to claim a chunk */

  const { userId, worldId, chunkId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  const world = await World.findById(worldId);
  if (!world) {
    res.status(404).json({ error: "World not found" });
    return;
  }
  const chunk = world.chunks.id(chunkId);
  if (!chunk) {
    res.status(404).json({ error: "Chunk not found" });
    return;
  }
  if (chunk.claimedBy !== null) {
    res.status(400).json({ error: "Chunk already claimed" });
    return;
  }

  const world_id = new mongoose.Types.ObjectId(worldId);
  const chunk_id = new mongoose.Types.ObjectId(chunkId);
  user.claims.push({ world: world_id, chunk: chunk_id });
  chunk.claimedBy = new mongoose.Types.ObjectId(userId);

  await world.save();
  await user.save();
  res.json({
    message: "Chunk claimed",
  });
});

// add endpoint for user to upload a chunk file
worldsRouter.put("/:worldId/chunks/:chunkId/file", async (req, res) => {});
