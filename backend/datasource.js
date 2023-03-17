import mongoose from "mongoose";
import ShareDB from "sharedb";
import ShareDbMongo from "sharedb-mongo";

import { config } from "./config.js";

const mongoURI = config.mongoURI;
const mongoDbName = config.mongoDbName;

let mongo_client = null;
let shareBackend = null; 

export const openMongoSession = async function () {
  if (!mongo_client) {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoURI, {
      dbName: mongoDbName,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
    mongoose.connection.once("open", () => {
      mongo_client = mongoose.connection.client;
      // Create ShareDB backend
      if (!shareBackend) {
        const db = new ShareDbMongo({ mongo: () => mongo_client });
        shareBackend = new ShareDB({ db });
      }
    });
  }
};

export const closeMongoSession = async function () {
  if (mongo_client) {
    await shareBackend.close();
    await mongoose.disconnect();
    mongo_client = null;
  }
};

export const getShareBackend = function () {
  return shareBackend;
}