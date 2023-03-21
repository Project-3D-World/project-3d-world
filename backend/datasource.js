import mongoose from "mongoose";
import ShareDB from "sharedb";
import ShareDbMongo from "sharedb-mongo";

import { config } from "./config.js";

const mongoURI = config.mongoURI;
const mongoDbName = config.mongoDbName;

let mongo_client = null;
let shareBackend = null;

export const openMongoSession = async function () {
  if (mongo_client === null) {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoURI, {
      dbName: mongoDbName,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    mongo_client = mongoose.connection.getClient();
    console.log("Connected to MongoDB");
    const db = new ShareDbMongo({
      mongo: (callback) => {
        callback(null, mongo_client);
      },
    });
    shareBackend = new ShareDB({ db });
  }
};

export const closeMongoSession = async function () {
  if (mongo_client) {
    await shareBackend.close();
    await mongoose.disconnect();
    mongo_client = null;
    shareBackend = null;
  }
};

export const getShareBackend = async function () {
  if (mongo_client === null) {
    await openMongoSession();
  }
  return shareBackend;
};
