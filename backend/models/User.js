import { getDB } from '../mongodb.js';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

const createUser = async (username, password) => {
  const db = getDB();
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.collection('users').insertOne({ username, password: hashedPassword });
    return 

  } catch (error) {
    console.log('error', error)
    // Uusername already exists
    if (error.code === 11000 || error.code === 11001) {
      throw new Error('Username already exists');
    }
    throw error;
  }
};

const findUserByUsername = async (username) => {
  const db = getDB();
  const user = await db.collection('users').findOne({ username });
  return user;
};

const findUserById = async (userId) => {
  const db = getDB();
  const user = await db.collection('users').findOne({ _id: ObjectId.createFromHexString(userId) });
  return user;
};

export { createUser, findUserByUsername, findUserById };
