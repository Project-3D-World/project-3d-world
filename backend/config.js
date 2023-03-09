"use strict";

import * as dotenv from "dotenv";
dotenv.config();

export const config = {
  mongoURI: process.env.MONGO_URI,
  mongoDbName: process.env.MONGO_DB_NAME,
  frontendBaseUrl: process.env.FRONTEND_BASE_URL,
  port: process.env.PORT,
};
