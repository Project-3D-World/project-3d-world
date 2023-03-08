import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";

import { openMongoSession, closeMongoSession } from "./datasource.js";

import { usersRouter } from "./routers/users_router.js";
import { worldsRouter } from "./routers/worlds_router.js";

const port = 3000; // default port
const app = express();

app.use(bodyParser.json());
app.use(morgan("dev")); // add request logger

// open MongoDB session
try {
  await openMongoSession();
} catch (err) {
  console.error(err);
}

// TODO: add other routers
app.use("/api/users", usersRouter);
app.use("/api/worlds", worldsRouter);

// start server
const server = app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});

// close mongo session and server
const cleanup = async () => {
  await closeMongoSession();
  server.close(() => {
    console.log("Server closed");
  });
};
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
