import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema({
  location: {
    x: { type: Number, required: true },
    z: { type: Number, required: true },
  },
  chunkFile: { type: mongoose.ObjectId, required: true },
});

const chunksValidator = function (chunks) {
  // the chunks must be unique by their location
  const locations = new Set();
  for (const chunk of chunks) {
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
  theme: String,
  rules: String,
  chunks: {
    type: [chunkSchema],
    validate: chunksValidator,
  },
});

export const World = mongoose.model("World", worldSchema);
