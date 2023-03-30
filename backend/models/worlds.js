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

const worldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  chunkSize: {
    x: { type: Number, required: true },
  },
  description: String,
  rules: String,
  chunks: {
    type: [chunkSchema],
  },
});

worldSchema.pre("validate", function (next) {
  // chunks must not overlap
  const chunkSize = this.chunkSize.x;
  const chunks = this.chunks;
  for (let i = 0; i < chunks.length; i++) {
    const c1 = chunks[i];
    for (let j = i + 1; j < chunks.length; j++) {
      const c2 = chunks[j];
      if (
        Math.abs(c1.location.x - c2.location.x) < chunkSize &&
        Math.abs(c1.location.z - c2.location.z) < chunkSize
      ) {
        next(new Error("Chunks overlap"));
        return;
      }
    }
  }
  next();
});

export const World = mongoose.model("World", worldSchema);
