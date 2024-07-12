// src/reducers/index.js
import { combineReducers } from 'redux';
import tasksReducer from '../features/tasks/tasksSlice.js';

const rootReducer = combineReducers({
  tasks: tasksReducer,
});

export default rootReducer;
