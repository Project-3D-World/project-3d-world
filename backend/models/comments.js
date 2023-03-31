import mongoose from "mongoose";
const commentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
    worldId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    chunk: {
      x: Number,
      z: Number,
    },
    content: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export const Comments = mongoose.model("Comments", commentSchema);
