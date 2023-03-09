import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import session from "express-session";
import { openMongoSession, closeMongoSession } from "./datasource.js";

import { config } from "./config.js";

import { usersRouter } from "./routers/users_router.js";
import { worldsRouter } from "./routers/worlds_router.js";

const port = config.port;
const app = express();

app.use(bodyParser.json());
app.use(morgan("dev")); // add request logger
//create session
app.use(
  session({
    secret: "Please change this secret",
    resave: false,
    saveUninitialized: true,
  })
);
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
