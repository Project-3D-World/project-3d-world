import { Router } from "express";
import multer from "multer";
import fs from "fs";

import { GridFile } from "../models/gridfiles.js";
import { World } from "../models/worlds.js";
import { User } from "../models/users.js";

// TODO: add user authentication

// Create a temp folder for storing uploaded files
const upload = multer({ dest: "./uploads" });

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

  const { worldId, chunkId } = req.params;
  const { userId } = req.body;
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

  user.claims.push({ world: worldId, chunk: chunkId });
  chunk.claimedBy = userId;

  await world.save();
  await user.save();
  res.json({
    message: "Chunk claimed",
  });
});

/* PUT /api/worlds/:worldId/chunks/:chunkId/file */
worldsRouter.put(
  "/:worldId/chunks/:chunkId/file",
  upload.single("chunkFile"),
  async (req, res) => {
    /* an endpoint for user to upload a chunk file */
    const { worldId, chunkId } = req.params;
    const { userId } = req.body;
    const chunkFile = req.file;
    if (!chunkFile) {
      res.status(400).json({ error: "No file provided" });
      return;
    }
    if (chunkFile.mimetype !== "model/gltf+json") {
      res
        .status(400)
        .json({ error: "Invalid file type, file type should be .gtlf" });
      fs.unlinkSync(chunkFile.path);
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      fs.unlinkSync(chunkFile.path);
      return;
    }
    const world = await World.findById(worldId);
    if (!world) {
      res.status(404).json({ error: "World not found" });
      fs.unlinkSync(chunkFile.path);
      return;
    }
    const chunk = world.chunks.id(chunkId);
    if (!chunk) {
      res.status(404).json({ error: "Chunk not found" });
      fs.unlinkSync(chunkFile.path);
      return;
    }
    if (chunk.claimedBy.toString() !== userId) {
      res
        .status(403)
        .json({ error: `This chunk is not claimed by the user ${userId}` });
      fs.unlinkSync(chunkFile.path);
      return;
    }

    // Upload the file to MongoDB and delete from /uploads
    const fileStream = fs.createReadStream(chunkFile.path);
    const gridFile = new GridFile({
      filename: chunkFile.originalname,
      contentType: chunkFile.mimetype,
      metadata: {
        world: worldId,
        chunk: chunkId,
      },
    });
    const uploadedChunk = await gridFile.upload(fileStream);
    fs.unlinkSync(chunkFile.path);

    // If there is already a file, delete it
    if (chunk.file !== null) {
      const oldFile = await GridFile.findById(chunk.chunkFile);
      if (oldFile) {
        await GridFile.deleteOne({ _id: oldFile._id });
      }
    }
    chunk.chunkFile = uploadedChunk.id;
    await world.save();
    res.json({
      message: "Chunk file uploaded",
      chunk: chunk,
    });
  }
);
