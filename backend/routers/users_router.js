import { Router } from "express";
import { User } from "../models/users.js";
import { isAuthenticated } from "../middleware/auth.js";
import { Db } from "mongodb";
import { World } from "../models/worlds.js";
import { Comments } from "../models/comments.js";
import { UserNotifications } from "../models/notifications.js";
// TODO: Create a mongoose model for users and import it here

export const usersRouter = Router();

// TODO: add users routes

//signup
usersRouter.post("/signup", async (req, res) => {
  //displayName:req.body.displayName
  //sub = req.body.sub
  //claims = []
  const user1 = await User.findOne({
    displayName: req.body.displayName,
  });
  if (user1 !== null) {
    return res.status(422).json({ error: "displayName already taken" });
  }
  const user = new User({
    sub: req.body.sub,
    displayName: req.body.displayName,
    email: req.body.email,
    claims: [],
  });

  const userNotifications = new UserNotifications({
    user: user._id,
    notifications: [],
  });

  try {
    await user.save();
    await userNotifications.save();
  } catch {
    return res.status(422).json({ error: "user creation failed" });
  }
  res.json(user);
});
//signin
usersRouter.post("/signin", async (req, res) => {
  //sub = req.body.sub

  const user = await User.findOne({
    sub: req.body.sub,
  });

  if (user === null) {
    return res
      .status(404)
      .json({ error: `User with sub : ${req.body.sub} not found` });
  }

  let userNotifications = await UserNotifications.findOne({
    user: user._id,
  });
  if (userNotifications === null) {
    userNotifications = new UserNotifications({
      user: user._id,
      notifications: [],
    });
    await userNotifications.save();
  }

  req.session.sub = user.sub;
  req.session.displayName = user.displayName;
  const userId = user._id.toString();
  req.session.userId = userId;
  console.log("Session started");
  console.log("-----------------------------------------------");
  console.log(`Req.session.sub is set to ${req.session.sub}`);
  console.log(`Req.session.displayName is set to ${req.session.displayName}`);
  console.log(`Req.session.userId is set to ${req.session.userId}`);
  return res.json({ userId: user._id, sub: user.sub });
});

usersRouter.get("/signout", isAuthenticated, function (req, res, next) {
  console.log("started");
  req.session.destroy();
  console.log("Session ended");
  console.log("-----------------------------------------------");
  res.json({ message: "Signed out" });
});

usersRouter.get("/me", isAuthenticated, async (req, res) => {
  return res.json({
    userId: req.session.userId,
    sub: req.session.sub,
    displayName: req.session.displayName,
  });
});
//getting all
usersRouter.get("/", async (req, res) => {
  const users = await User.find();
  return res.json(users);
});

//getting claims
usersRouter.get(
  "/myClaims/page=:page&limit=:limit",
  isAuthenticated,
  async (req, res) => {
    const page = parseInt(req.params.page);
    const limit = parseInt(req.params.limit);
    const user = await User.findById(req.session.userId).populate(
      "claims.world"
    );
    const claims = [
      ...new Map(user.claims.map((m) => [m.world._id, m])).values(),
    ];
    const claimsPostSlice = claims.slice(
      page * limit,
      page * limit + limit + 1
    );
    return res.json(claimsPostSlice);
  }
);

//getSumofUpvotesandDownvotes
usersRouter.get("/allusers/ratings", async (req, res) => {
  const items = await User.find().populate("ratings");
  let returnItems = [];
  items.forEach((item) => {
    let sum = 0;
    for (let i = 0; i < item.ratings.length; i++) {
      sum += item.ratings[0].rating;
    }
    const avg = sum / item.ratings.length;
    returnItems.push({
      email: item.email,
      name: item.displayName,
      avgRating: avg,
    });
  });
  return res.json(returnItems);
});
