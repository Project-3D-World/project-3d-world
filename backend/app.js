import express from "express";
import expressWs from "express-ws";
import bodyParser from "body-parser";
import morgan from "morgan";
import session from "express-session";
import cors from "cors";

import { openMongoSession, closeMongoSession } from "./datasource.js";
import { config } from "./config.js";

import { usersRouter } from "./routers/users_router.js";
import { worldsRouter } from "./routers/worlds_router.js";
import { commentsRouter } from "./routers/comments_router.js";

const port = config.port;
const app = express();
const wsInstance = expressWs(app);

app.use(bodyParser.json());
app.use(morgan("dev")); // add request logger
//create session
app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
  })
);

//cors
app.use(express.static("static"));
const corsOptions = {
  origin: config.frontendBaseUrl,
  credentials: true,
};
app.use(cors(corsOptions));

// open MongoDB session
try {
  await openMongoSession();
} catch (err) {
  console.error(err);
}

// TODO: add other routers
app.use("/api/users", usersRouter);
app.use("/api/worlds", worldsRouter);
app.use( '/api/comments',commentsRouter)
// start server
const server = app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});

// close mongo session and server
const cleanup = async () => {
  wsInstance.getWss().clients.forEach((client) => {
    client.close();
  });
  await closeMongoSession();
  server.close((err) => {
    console.log("Server closed");
    process.exit(err ? 1 : 0);
  });
};
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
