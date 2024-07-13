import { getDB } from '../mongodb.js';
import { ObjectId } from 'mongodb';

const createTask = async (title, description, status, userId) => {
  const db = getDB();
  const newTaskId = await db.collection('tasks').insertOne({ title, description, status, user: userId });
  return newTaskId.insertedId;
};

const getTotalTasks = async (userId) => {
  const db = getDB();
  const totalTasks = await db.collection('tasks').countDocuments({ user: userId });
  return totalTasks;
};

const findTasks = async (userId, { page = 1, limit = 10, search = '', sort = 'createdAt', isSearchOn = false }) => {
  const db = getDB();
  const query = { user: userId };

  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }

  let tasks;
  if (isSearchOn) {
    tasks = await db.collection('tasks')
      .find(query)
      .sort({ [sort]: 1 })
      .toArray();
  } else {
    tasks = await db.collection('tasks')
      .find(query)
      .sort({ [sort]: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .toArray();
  }

  const totalTasks = await getTotalTasks(userId);
  const totalPages = Math.ceil(totalTasks / limit);

  return { tasks, totalTasks, totalPages };
};

// Function to update a task
const updateTask = async (id, update) => {
  const db = getDB();
  await db.collection('tasks').findOneAndUpdate({ _id: ObjectId.createFromHexString(id) }, { $set: update }, { returnOriginal: false });
  return;
};

// Function to delete a task
const deleteTask = async (id) => {
  const db = getDB();
  const result = await db.collection('tasks').findOneAndDelete({ _id: ObjectId.createFromHexString(id) });
  return result.value;
};

export { createTask, findTasks, updateTask, deleteTask, getTotalTasks };
