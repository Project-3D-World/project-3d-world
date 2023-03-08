import { Router } from "express";
import { User } from "../models/users.js";
// TODO: Create a mongoose model for users and import it here

export const usersRouter = Router();

// TODO: add users routes


//signup
usersRouter.post("/signup", async (req, res) => {
  //displayName:req.body.displayName
  //sub = req.body.sub
  //claims = []
  const user1 = await User.findOne({
    displayName:req.body.displayName
  });
  if(user1 !== null){
    return res.status(422).json({error:"displayName already taken"});
  }
  const user = new User({
    sub: req.body.sub,
    displayName: req.body.displayName,
    claims: [],
  });

  try {
    await user.save();
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
  req.session.sub = user.sub;
  req.session.displayName = user.displayName;
  req.session.claims = user.claims;
  console.log("Session started");
  console.log("-----------------------------------------------");
  console.log(`Req.session.sub is set to ${req.session.sub}`);
  console.log(`Req.session.displayName is set to ${req.session.displayName}`);
  console.log(`Req.session.claims is set to ${req.session.claims}`);
  return res.json(user);
});

usersRouter.get("/signout", function (req, res, next) {
  console.log("started");
  req.session.destroy();
  console.log("Session ended");
  console.log("-----------------------------------------------");
  res.redirect("/");
});

usersRouter.get("/me",async (req,res)=>{
  return res.json({
    sub:req.session.sub,
    displayName:req.session.displayName
  })
})
//getting all
usersRouter.get("/", async (req, res) => {
  const users = await User.find();
  return res.json(users);
});
//getting one
usersRouter.get("/:id", async (req, res) => {});

//updating one
usersRouter.patch("/:id", async (req, res) => {});

//deleting one
usersRouter.delete("/:id", async (req, res) => {});


