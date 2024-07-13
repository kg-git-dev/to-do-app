import { createSlice, createSelector, useSelector } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchTasks = (search, page, limit) => async (dispatch, getState) => {
  const state = getState();

  if (state.tasks.tasks.items[page]?.length > 0) return; // Do not fetch if tasks are already in the store

  try {
    dispatch(setLoading());
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:3000/tasks?search=${search}&page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch(setTasks({ tasks: response.data.tasks, page }));
    dispatch(setTotalPages(response.data.totalPages));
  } catch (error) {
    console.error('Error fetching tasks', error);
  } finally {
    dispatch(setIdle());
  }
};

export const addTask = (task) => async (dispatch) => {
  try {
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:3000/tasks', task, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(clearAllPages());
  } catch (error) {
    console.error('Error adding task', error);
  }
};

export const deleteTask = (taskId) => async (dispatch) => {
  try {
    const token = localStorage.getItem('token');
    console.log('before request', taskId)
    await axios.delete(`http://localhost:3000/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(clearAllPages());
  } catch (error) {
    console.error('Error deleting task', error);
  }
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: {},
    currentPage: 1,
    totalPages: 1,
    status: 'idle',
    error: null,
  },
  reducers: {
    setTasks: (state, action) => {
      const { tasks, page } = action.payload;
      state.items[page] = tasks;
      state.status = 'succeeded';
    },
    setTotalPages: (state, action) => {
      state.totalPages = action.payload;
    },
    clearAllPages: (state) => {
      state.items = {};
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setLoading: (state) => {
      state.status = 'loading';
    },
    setIdle: (state) => {
      state.status = 'idle';
    },
  },
});

export const { setTasks, setTotalPages, clearAllPages, setCurrentPage, setLoading, setIdle } = tasksSlice.actions;


// Selectors
const selectTasksState = (state) => state.tasks;

export const selectTasks = createSelector(
  [selectTasksState],
  (tasksState) => tasksState.tasks.items[tasksState.tasks.currentPage] || []
);

export const getCurrentState = createSelector(
  [selectTasksState],
  (tasksState) => tasksState.tasks.status
);

export const selectTotalPages = createSelector(
  [selectTasksState],
  (tasksState) => tasksState.tasks.totalPages
);

export const selectCurrentPage = createSelector(
  [selectTasksState],
  (tasksState) => tasksState.tasks.currentPage
);

export default tasksSlice.reducer;