import { getDB } from '../mongodb.js';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

const createUser = async (username, password) => {
  username = username.trim();

  if (!username || username.length < 1) {
    throw new Error('Username must be at least one character long and cannot be just spaces');
  }

  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }

  const db = getDB();
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await db.collection('users').insertOne({ username, password: hashedPassword });

    return { _id: result.insertedId, username };

  } catch (error) {
    if (error.code === 11000) {
      throw new Error('Username already exists');
    }
    throw error;
  }
};

const findUserByUsername = async (username) => {
  try {
    const db = getDB();
    const user = await db.collection('users').findOne({ username });
    if (!user) {
      throw new Error();
    }
    return user;
  } catch (error) {
    throw new Error('Failed to find by username');
  }

};

const findUserById = async (userId) => {
  try {
    const db = getDB();
    const user = await db.collection('users').findOne({ _id: ObjectId.createFromHexString(userId) });
    if (!user) {
      throw new Error();
    }
    return user;
  } catch (err) {
    throw new Error('Failed to find user by ID');
  }
};

export { createUser, findUserByUsername, findUserById };
