import mongoose from "mongoose";

const claimsSchema = new mongoose.Schema({
  world: { type: mongoose.SchemaTypes.ObjectId, ref: "World" },
  chunk: mongoose.SchemaTypes.ObjectId,
});
const userSchema = new mongoose.Schema({
  sub: {
    type: String,
    required: true,
    unique: true,
  },
  displayName: {
    required: true,
    type: String,
    unique: true,
  },
  claims: {
    type: [claimsSchema],
    required: true,
  },
});

export const User = mongoose.model("User", userSchema);
