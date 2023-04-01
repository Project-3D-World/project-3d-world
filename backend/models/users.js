import mongoose from "mongoose";

const validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

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
  ratings: {
    type: [{type:mongoose.SchemaTypes.ObjectId,ref:"Comments"}],
    default: [],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: "Email address is required",
    validate: [validateEmail, "Please fill a valid email address"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
});

export const User = mongoose.model("User", userSchema);
