import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema({
  location: {
    x: Number,
    y: Number,
  },
  size: {
    x: Number,
    y: Number,
  },
  chunkFile: mongoose.ObjectId,
});

const worldSchema = new mongoose.Schema({
  name: String,
  theme: String,
  rules: String,
  chunks: [chunkSchema],
});

export const World = mongoose.model("Worlds", worldSchema);
