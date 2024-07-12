// src/features/tasks/tasksSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchTasks = (search, page, limit) => async (dispatch) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:3000/tasks?search=${search}&page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(setTasks(response.data));
  } catch (error) {
    console.error('Error fetching tasks', error);
  }
};

export const addTask = (task) => async (dispatch) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post('http://localhost:3000/tasks', task, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(addNewTask(response.data));
  } catch (error) {
    console.error('Error adding task', error);
  }
};

export const deleteTask = (taskId) => async (dispatch) => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:3000/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(removeTask(taskId));
  } catch (error) {
    console.error('Error deleting task', error);
  }
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: new Array(),
    totalPages: 1,
    status: 'idle',
    error: null,
  },
  reducers: {
    setTasks: (state, action) => {
      state.items = action.payload;
    },
    setTotalPages: (state, action) => {
      state.totalPages = action.payload;
    },
    addNewTask: (state, action) => {
      state.items.push(action.payload);
    },
    removeTask: (state, action) => {
      state.items = state.items.filter((task) => task._id !== action.payload);
    },
  },
});

export const { setTasks, setTotalPages, addNewTask, removeTask } = tasksSlice.actions;

export default tasksSlice.reducer;
