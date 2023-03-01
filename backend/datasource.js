import { MongoClient } from 'mongodb';

const mongoURI = "mongodb://127.0.0.1:27017"; // default uri
const dbName = "buildVerse";

const client = new MongoClient(mongoURI, { useUnifiedTopology: true });
let dbInstance = null;

export const openMongoSession = async function () {
  if (!dbInstance) {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected to MongoDB');
    dbInstance = client.db(dbName);
  }
};

export const getMongoSession = async function () {
  return dbInstance;
};

export const closeMongoSession = async function () {
  if (dbInstance) {
    await client.close();
    dbInstance = null;
  }
};
