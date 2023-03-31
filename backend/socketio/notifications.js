import { Server } from "socket.io";
import { Redis } from "ioredis";

import { isSocketAuthenticated } from "../middleware/auth.js";

let io;
const redisClient = new Redis(); // connect to default localhost:6379

export const initSocketIOFromServer = (
  server,
  sessionMiddleware,
  corsOptions
) => {
  io = new Server(server, {
    path: "/notifications/",
    cors: corsOptions,
  });
  io.engine.use(sessionMiddleware);
  io.use(isSocketAuthenticated);

  io.on("connection", (socket) => {
    initializeUser(socket);

    socket.on("notification", (notification) => onNotify(socket, notification));

    socket.on("disconnect", () => onDisconnect(socket));
  });
};

export const closeRedisConnection = () => {
  redisClient.disconnect();
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
    unotifiedReviews: 0
  });

  if (status) {
    socket.emit("summaryNotification", {
      reviews: status.unotifiedReviews,
    });
  }
};

const onNotify = async (socket, notification) => {
  const receiverId = notification.receiver;

  const receiverStatus = await redisClient.hget(
    `userId:${receiverId}`,
    "online"
  );
  if (receiverStatus === "false") {
    redisClient.hincrby(
      `userId:${receiverId}`,
      `unotifiedReviews`,
      1
    );
  } else {
    socket.to(receiverId).emit("notification", {
      sender: socket.user.displayName,
      rating: notification.rating,
      worldId: notification.worldId,
      worldName: notification.worldName,
    });
  }
};

const onDisconnect = (socket) => {
  // TODO: update online status of user in redis
  redisClient.hset(`userId:${socket.user.userId}`, "online", false);
};
