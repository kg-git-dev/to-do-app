import { getDB } from '../mongodb.js';
import { ObjectId } from 'mongodb';

const createTask = async (title, description, status, userId) => {
  const db = getDB();
  await db.collection('tasks').insertOne({ title, description, status, user: userId });
  return;
};

const findTasks = async (userId, { page = 1, limit = 10, search = '', sort = 'createdAt' }) => {
  const db = getDB();
  const tasks = await db.collection('tasks')
    .find({user: userId, title: { $regex: search, $options: 'i' } })
    .sort({ [sort]: 1 })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .toArray();
  return tasks;
};

const updateTask = async (id, update) => {
  const db = getDB();
  await db.collection('tasks').findOneAndUpdate({ _id: ObjectId.createFromHexString(id)}, { $set: update }, { returnOriginal: false });
  return;
};

const deleteTask = async (id) => {
  const db = getDB();
  const result = await db.collection('tasks').findOneAndDelete({ _id: ObjectId.createFromHexString(id) });
  return result.value;
};

export { createTask, findTasks, updateTask, deleteTask };
