import { Server } from "socket.io";

import { config } from "./config.js";

let io;

export const initSocketIOFromServer = (server) => {
  io = new Server(server, {
    path: "/notifications/",
    cors: {
      origin: config.frontendBaseUrl,
      methods: ["GET", "POST"],
    },
  });
}