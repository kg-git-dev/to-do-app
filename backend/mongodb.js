import { MongoClient } from 'mongodb';

const mongoUrl = process.env.MONGO_URI;
const client = new MongoClient(mongoUrl);

let db;

const connectDB = async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db(); 
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error('Database not connected. Call connectDB first.');
  }
  return db;
};

export { connectDB, getDB };
