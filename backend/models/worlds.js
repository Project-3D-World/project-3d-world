import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema({
  location: {
    x: { type: Number, required: true },
    z: { type: Number, required: true },
  },
  chunkFile: { type: mongoose.ObjectId, required: true },
});

const worldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  chunkSize: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    z: { type: Number, required: true },
  },
  theme: String,
  rules: String,
  chunks: [chunkSchema],
});

export const World = mongoose.model("World", worldSchema);
