import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      required: true,
    },
    worldId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    chunk: {
      x: Number,
      z: Number,
    },
  },
  { timestamps: true }
);

const userNotificationsSchema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "User",
  },
  notifications: {
    type: [notificationSchema],
    default: [],
  },
});

export const UserNotifications = mongoose.model(
  "UserNotifications",
  userNotificationsSchema
);
