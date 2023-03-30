import mongoose from "mongoose";
const commentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref:'User'
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
  },
  {
    timestamps: true,
  }
);
export const Comments = mongoose.model("Comments", commentSchema);
