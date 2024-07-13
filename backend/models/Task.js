import { getDB } from '../mongodb.js';
import { ObjectId } from 'mongodb';

const createTask = async (title, description, status, userId) => {
  const db = getDB();
  const newTaskId = await db.collection('tasks').insertOne({ title, description, status, user: userId, createdAt: new Date() });
  return newTaskId.insertedId;
};

const getTotalTasks = async (userId) => {
  const db = getDB();
  const totalTasks = await db.collection('tasks').countDocuments({ user: userId });
  return totalTasks;
};

const findTasks = async (userId, { page = 1, limit = 10, search = '', sort = 'latest', sortOrder = 1 }) => {
  const db = getDB();
  const query = { user: userId };
  let tasks;
  let totalTasks;

  let sortQuery = {};
  if (sort === 'oldest') {
    sortQuery = { createdAt: 1 };
  } else {
    sortQuery = { createdAt: -1 };
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
    tasks = await db.collection('tasks')
      .find(query)
      .sort(sortQuery)
      .toArray();
    totalTasks = tasks.length;
  } else {
    tasks = await db.collection('tasks')
      .find(query)
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .toArray();
    totalTasks = await getTotalTasks(userId);
  }

  const totalPages = Math.ceil(totalTasks / limit);

  return { tasks, totalTasks, totalPages };
};

const updateTask = async (id, { status }) => {
  const db = getDB();
  const update = { status };

  const result = await db.collection('tasks').findOneAndUpdate(
    { _id: ObjectId.createFromHexString(id) },
    { $set: update },
    { returnOriginal: false }
  );

  if (!result.value) {
    throw new Error(`Task with id ${id} not found.`);
  }
};

const deleteTask = async (id) => {
  const db = getDB();
  await db.collection('tasks').findOneAndDelete({ _id: ObjectId.createFromHexString(id) });
  return ;
};

export { createTask, findTasks, updateTask, deleteTask };
