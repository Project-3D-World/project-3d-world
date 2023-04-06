import { Router } from "express";
import multer from "multer";
import fs from "fs";
import patch from "express-ws/lib/add-ws-method.js";
import WebSocketJSONStream from "@teamwork/websocket-json-stream";

import { getShareBackend } from "../datasource.js";

import { isAuthenticated, isWsAuthenticated } from "../middleware/auth.js";
import { GridFile } from "../models/gridfiles.js";
import { World } from "../models/worlds.js";
import { User } from "../models/users.js";

import { validateGltfZip, deleteFile, validateIds } from "./utils.js";

// Create a temp folder for storing uploaded files
const upload = multer({ dest: "./uploads" });

// Get the shareDB backend
const shareBackend = await getShareBackend();

export const worldsRouter = Router();
patch.default(worldsRouter);

/* GET /api/worlds */
worldsRouter.get("/", isAuthenticated, async (req, res) => {
  const worlds = await World.find().lean();
  res.json({ worlds });
});

/* GET /api/worlds/:id */
worldsRouter.get("/:id", isAuthenticated, async (req, res) => {
  if (!validateIds([req.params.id])) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }
  const world = await World.findById(req.params.id).lean();
  if (!world) {
    res.status(404).json({ error: "World not found" });
    return;
  }
  res.json({ world });
});

/* GET /api/worlds/:worldId/chunks/:chunkId/file */
worldsRouter.get(
  "/:worldId/chunks/:chunkId/file",
  isAuthenticated,
  async (req, res) => {
    const { worldId, chunkId } = req.params;
    if (!validateIds([worldId, chunkId])) {
      res.status(400).json({ error: "Invalid ID" });
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
    if (chunk.fileId === null) {
      res.status(404).json({ error: "Chunk is currently empty" });
      return;
    }
    const chunkFile = await GridFile.findById(chunk.chunkFile);
    if (!chunkFile) {
      res.status(404).json({ error: "Chunk file not found" });
      return;
    }

    res.header("Content-Type", chunkFile.contentType);
    chunkFile.downloadStream(res);
  }
);

/* POST /api/worlds */
worldsRouter.post("/", isAuthenticated, async (req, res) => {
  /* req.body should be:
  {
    name: string,
    chunkSize: { x: number, y: number, z: number },
    description: string,
    rules: string,
    chunks: [{ x: number, z: number }]
  } 
  */
  // Check for admin permissions
  const user = await User.findById(req.session.userId);
  if (!user.isAdmin) {
    res
      .status(403)
      .json({ error: "You do not have permission to add a world" });
    return;
  }
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
    if (err.message === "Chunks overlap") {
      res.status(400).json({ error: err.message });
      return;
    }
  }
  res.json(world);
});

/* PATCH /api/worlds/:worldId/chunks/:chunkId */
worldsRouter.patch(
  "/:worldId/chunks/:chunkId",
  isAuthenticated,
  async (req, res) => {
    /* an endpoint for a user to claim a chunk */

    const { worldId, chunkId } = req.params;
    const userId = req.session.userId;
    if (!validateIds([worldId, chunkId])) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

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

    // Update the live world if it exists
    const liveWorld = shareBackend.connect().get("live_worlds", worldId);
    liveWorld.fetch((err) => {
      if (err) {
        return;
      }
      if (liveWorld.type) {
        const chunkIndex = liveWorld.data.chunks.findIndex(
          (c) =>
            c.location.x === chunk.location.x &&
            c.location.z === chunk.location.z
        );
        liveWorld.submitOp([
          {
            p: ["chunks", chunkIndex, "claimedBy"],
            oi: userId,
          },
        ]);
      }
    });

    res.json({
      message: "Chunk claimed",
    });
  }
);

/* POST /api/worlds/:worldId/chunks/:chunkId/file */
worldsRouter.post(
  "/:worldId/chunks/:chunkId/file",
  isAuthenticated,
  upload.single("chunkFile"),
  async (req, res) => {
    /* an endpoint for user to upload a chunk file */
    const { worldId, chunkId } = req.params;
    const userId = req.session.userId;
    const chunkFile = req.file;
    if (!chunkFile) {
      res.status(400).json({ error: "No file provided" });
      return;
    }
    try {
      await validateGltfZip(chunkFile.path);
    } catch (err) {
      deleteFile(chunkFile.path);
      res.status(400).json({ error: err.message });
      return;
    }

    if (!validateIds([worldId, chunkId])) {
      res.status(400).json({ error: "Invalid ID" });
      deleteFile(chunkFile.path);
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      deleteFile(chunkFile.path);
      return;
    }
    const world = await World.findById(worldId);
    if (!world) {
      res.status(404).json({ error: "World not found" });
      deleteFile(chunkFile.path);
      return;
    }
    const chunk = world.chunks.id(chunkId);
    if (!chunk) {
      res.status(404).json({ error: "Chunk not found" });
      deleteFile(chunkFile.path);
      return;
    }
    if (!chunk.claimedBy || chunk.claimedBy.toString() !== userId) {
      res
        .status(403)
        .json({ error: `This chunk is not claimed by the user ${userId}` });
      deleteFile(chunkFile.path);
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
    deleteFile(chunkFile.path);

    // If there is already a file, delete it
    if (chunk.file !== null) {
      const oldFile = await GridFile.findById(chunk.chunkFile);
      if (oldFile) {
        await GridFile.deleteOne({ _id: oldFile._id });
      }
    }
    chunk.chunkFile = uploadedChunk.id;
    await world.save();

    // Update the live world if it exists
    const liveWorld = shareBackend.connect().get("live_worlds", worldId);
    liveWorld.fetch((err) => {
      if (err) {
        return;
      }
      if (liveWorld.type) {
        const chunkIndex = liveWorld.data.chunks.findIndex(
          (c) =>
            c.location.x === chunk.location.x &&
            c.location.z === chunk.location.z
        );
        if (chunkIndex !== -1) {
          liveWorld.submitOp([
            {
              p: ["chunks", chunkIndex, "chunkFile"],
              oi: uploadedChunk.id,
            },
          ]);
        }
      }
    });

    res.json({
      message: "Chunk file uploaded",
      chunk: chunk,
    });
  }
);

/* WS /api/worlds/:worldId/live */
worldsRouter.ws("/:worldId/live", isWsAuthenticated, async (ws, req) => {
  if (!validateIds([req.params.worldId])) {
    ws.close(4000, "Invalid world ID");
    return;
  }
  const world = await World.findById(req.params.worldId);
  if (!world) {
    ws.close(4004, "World not found");
    return;
  }
  const connection = shareBackend.connect();
  const liveWorld = connection.get("live_worlds", req.params.worldId);

  // Create live world if it doesn't exist
  liveWorld.subscribe((err) => {
    if (err) {
      ws.close(1011, "Error fetching live world");
      return;
    }
    if (liveWorld.type === null) {
      const data = {
        chunks: world.chunks,
      };
      liveWorld.create(data, "json0");
    }
  });

  const stream = new WebSocketJSONStream(ws);
  stream.on("error", (err) => {
    if (err.name !== "Error [ERR_CLOSED]") {
      console.error(err);
    }
  });
  shareBackend.listen(stream);

  // listen to live world changes and update mongoDB
  liveWorld.on("op", (ops, source) => {
    if (source) {
      return;
    }
    const chunkIndex = ops[0].p[1];
    if (ops[0].p[2] === "upvotes" || ops[0].p[2] === "downvotes") {
      const chunkId = liveWorld.data.chunks[chunkIndex]._id;
      const chunk = world.chunks.id(chunkId);
      chunk[ops[0].p[2]] += ops[0].na ? ops[0].na : 0;
      world.save();
    }
  });
});
