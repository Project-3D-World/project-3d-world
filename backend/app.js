import express from "express";
import expressWs from "express-ws";
import { createServer } from "http"
import bodyParser from "body-parser";
import morgan from "morgan";
import session from "express-session";
import cors from "cors";
import cron from "node-cron";
import { openMongoSession, closeMongoSession } from "./datasource.js";
import { initSocketIOFromServer } from "./socketio/notifications.js";
import { config } from "./config.js";
import sgMail from "@sendgrid/mail";

import { usersRouter } from "./routers/users_router.js";
import { worldsRouter } from "./routers/worlds_router.js";
import { commentsRouter } from "./routers/comments_router.js";

const port = config.port;
const app = express();
const wsInstance = expressWs(app);

app.use(bodyParser.json());
app.use(morgan("dev")); // add request logger

//create session
const sessionMiddleware = session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: true,
});
app.use(sessionMiddleware);

//cors
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
app.use("/api/comments", commentsRouter);

//cronjob
cron.schedule("* * * * *", () => {
  console.log("running a task every minute");
  /*
  sgMail.setApiKey(config.sendGrid_Api_key);
const msg = {
  to: 'youngjaeheo2002@gmail.com', // Change to your recipient
  from: 'buildverse242@gmail.com', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
  */
  sgMail.setApiKey(config.sendGrid_Api_key);
  fetch(`http://localhost:${port}/api/users/allusers/upvotesanddownvotes`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((res) => {
      res.forEach((item) => {
        const msg = {
          to: `${item.email}`, // Change to your recipient
          from: "buildverse242@gmail.com", // Change to your verified sender
          subject: "Upvotes and Downvotes",
          text: `You have ${item.upvotes} upvotes and ${item.downvotes} downvotes`,
        };
        sgMail
          .send(msg)
          .then(() => {
            console.log("Email sent");
          })
          .catch((error) => {
            console.error(error);
          });
      });
    });
});
// start server
const server = createServer(app);
initSocketIOFromServer(server, sessionMiddleware, corsOptions);
server.listen(port, () => {
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
