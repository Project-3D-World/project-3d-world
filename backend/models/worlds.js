import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema({
  location: {
    x: { type: Number, required: true },
    z: { type: Number, required: true },
  },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  chunkFile: { type: mongoose.ObjectId, default: null },
  claimedBy: { type: mongoose.ObjectId, default: null },
});

const chunksValidator = function (chunks) {
  // the chunks must be unique by their location
  const locations = new Set();
  for (const c of chunks) {
    if (locations.has(c.location)) {
      return false;
    }
    locations.add(c.location);
  }
  return true;
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
