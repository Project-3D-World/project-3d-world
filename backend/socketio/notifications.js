import { wrap } from "module";
import { Server } from "socket.io";

import { config } from "./config.js";
import { isSocketAuthenticated } from "./middleware/auth.js";

let io;

export const initSocketIOFromServer = (server, sessionMiddleware, corsOptions) => {
  io = new Server(server, {
    path: "/notifications/",
    cors: corsOptions,
  });
  io.use(wrap(sessionMiddleware));
  io.use(isSocketAuthenticated);
}

