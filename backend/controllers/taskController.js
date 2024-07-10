import { createTask, findTasks, updateTask, deleteTask } from '../models/Task.js';

const getTasks = async (req, res) => {
  const { page = 1, limit = 10, search = '', sort = 'createdAt' } = req.query;
  try {
    const tasks = await findTasks(req.user._id, { page, limit, search, sort });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addTask = async (req, res) => {
  const { title, description, status } = req.body;
  try {
    await createTask(title, description, status, req.user._id);
    res.status(201).json({message: "Successfully added task"});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const modifyTask = async (req, res) => {
  const { id } = req.params;
  const update = req.body;
  
  try {
    await updateTask(id, update);
    res.json({message: "task updated"});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeTask = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteTask(id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { getTasks, addTask, modifyTask, removeTask };
