import mongoose from "mongoose";

import { config } from "./config.js";

const mongoURI = config.mongoURI;
const mongoDbName = config.mongoDbName;

let mongo_client = null; // this client will be used for sharedb later

export const openMongoSession = async function () {
  if (!mongo_client) {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoURI, {
      dbName: mongoDbName,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
    mongo_client = mongoose.connection.client;
  }
};

export const closeMongoSession = async function () {
  if (mongo_client) {
    await mongoose.disconnect();
    mongo_client = null;
  }
};
