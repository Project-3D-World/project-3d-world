import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema({
  location: {
    x: { type: Number, required: true },
    z: { type: Number, required: true },
  },
  chunkFile: { type: mongoose.ObjectId, required: true, default: null },
  claimedBy: { type: mongoose.ObjectId, required: true, default: null },
});

const chunksValidator = function (chunks) {
  // the chunks must be unique by their location
  const locations = new Set();
  for (const chunk of chunks) {
    if (
      typeof chunk.location.x !== "number" ||
      typeof chunk.location.z !== "number"
    ) {
      return false;
    }
    if (locations.has(location)) {
      return false;
    }
    locations.add(location);
  }
};

const worldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  chunkSize: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    z: { type: Number, required: true },
  },
  description: String,
  rules: String,
  chunks: {
    type: [chunkSchema],
    validate: [chunksValidator, "Duplicate chunk locations"],
  },
});

export const World = mongoose.model("World", worldSchema);
