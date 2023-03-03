import { Router } from "express";

// TODO: Create a mongoose model for users and import it here

export const usersRouter = Router();

// TODO: add users routes

//getting all
usersRouter.get("/", async (req, res) => {});
//getting one
usersRouter.get("/:id", async (req, res) => {});

//updating one
usersRouter.patch("/:id", async (req, res) => {});

//deleting one
usersRouter.delete("/:id", async (req, res) => {});

//signup
usersRouter.post("/signup", async (req, res) => {});
//signin
usersRouter.post("/signin", async (req, res) => {});
