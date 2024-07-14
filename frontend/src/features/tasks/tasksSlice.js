import { createSlice, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchTasks = (search, page, limit) => async (dispatch, getState) => {
  const state = getState();
  const tasksState = state.tasks.tasks;

  if (search) {
    // Fetch search results if not already fetched
    if (!tasksState.search[search]) {
      try {
        dispatch(setLoading());
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/tasks?search=${search}&page=${page}&limit=${limit}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        dispatch(setSearchResults({ tasks: response.data.tasks, totalTasks: response.data.totalTasks, page, search }));
      } catch (error) {
        console.error('Error fetching tasks', error);
      } finally {
        dispatch(setIdle());
      }
    }
  } else {
    // Fetch tasks if not already fetched
    if (!tasksState.items[page] || tasksState.items[page].length === 0) {
      try {
        dispatch(setLoading());
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/tasks?page=${page}&limit=${limit}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        dispatch(setTasks({ tasks: response.data.tasks, totalTasks: response.data.totalTasks, page }));
        dispatch(setTotalPages({ totalPages: response.data.totalPages }));
      } catch (error) {
        console.error('Error fetching tasks', error);
      } finally {
        dispatch(setIdle());
      }
    }
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

export const updateTask = (id, { status, title, description }) => async (dispatch) => {
  try {
    const token = localStorage.getItem('token');
    await axios.put(`http://localhost:3000/tasks/${id}`, { status, title, description }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await dispatch(clearAllPages());
  } catch (error) {
    console.error('Error updating task', error);
  }
};

export const deleteTask = (taskId) => async (dispatch) => {
  try {
    const token = localStorage.getItem('token');
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
    search: {},
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
    setSearchResults: (state, action) => {
      const { tasks, totalTasks, page, search } = action.payload;
      if (!state.search[search]) {
        state.search[search] = {};
      }
      state.search[search] = tasks;
      state.search[search].totalTasks = totalTasks
      state.status = 'succeeded';
    },
    setTotalPages: (state, action) => {
      const { totalPages } = action.payload;
      state.totalPages = totalPages
    },
    clearAllPages: (state) => {
      state.items = {};
      state.search = {};
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

export const { setTasks, setSearchResults, setTotalPages, clearAllPages, setCurrentPage, setLoading, setIdle } = tasksSlice.actions;

// Selectors
const selectTasksState = (state) => state.tasks.tasks;

export const selectTasks = createSelector(
  [selectTasksState],
  (tasksState) => tasksState.items[tasksState.currentPage] || []
);

export const selectSearchResults = createSelector(
  [selectTasksState],
  (tasksState) => tasksState.search
);

export const getCurrentState = createSelector(
  [selectTasksState],
  (tasksState) => tasksState.status
);

export const selectTotalPages = createSelector(
  [selectTasksState],
  (tasksState) => tasksState.totalPages
);

export const selectCurrentPage = createSelector(
  [selectTasksState],
  (tasksState) => tasksState.currentPage
);

export default tasksSlice.reducer;
