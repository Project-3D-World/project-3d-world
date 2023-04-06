import { Server } from "socket.io";
import { Redis } from "ioredis";

import { config } from "../config.js";
import { isSocketAuthenticated } from "../middleware/auth.js";

let io;
let redisClient;
try {
  redisClient = new Redis({
    port: 6379,
    host: config.redisURI,
  });
} catch (err) {
  console.log(err);
}

const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

export const initSocketIOFromServer = (
  server,
  sessionMiddleware,
  corsOptions
) => {
  io = new Server(server, {
    cors: corsOptions,
  });
  io.use(wrap(sessionMiddleware));
  io.use(isSocketAuthenticated);

  console.log("SocketIO initialized");

  io.on("connection", (socket) => {
    console.log("SocketIO connected");
    initializeUser(socket);

    socket.on("disconnect", () => onDisconnect(socket));
  });
};

export const closeNotification = () => {
  redisClient.quit();
  io.close();
};

export const sendNotification = async (receiver, notification) => {
  const receiverStatus = await redisClient.hget(`userId:${receiver}`, "online");
  if (receiverStatus === "false") {
    redisClient.hincrby(`userId:${receiver}`, `unotifiedReviews`, 1);
  } else {
    io.to(receiver).emit("notification", notification);
  }
};

const initializeUser = async (socket) => {
  socket.user = {
    sub: socket.request.session.sub,
    displayName: socket.request.session.displayName,
    userId: socket.request.session.userId,
  };
  socket.join(socket.user.userId);

  const status = await redisClient.hgetall(`userId:${socket.user.userId}`);

  redisClient.hmset(`userId:${socket.user.userId}`, {
    online: true,
    unotifiedReviews: 0,
  });

  if (status) {
    socket.emit("notification", {
      unseen: +status.unotifiedReviews,
    });
  }
};

const onDisconnect = (socket) => {
  console.log("SocketIO disconnected");
  redisClient.hset(`userId:${socket.user.userId}`, "online", false);
};
