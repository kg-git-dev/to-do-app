import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, addTask, deleteTask } from '../features/tasks/tasksSlice';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';

const TaskList = () => {
  const dispatch = useDispatch();
  const tasks = useSelector(state => state.tasks.tasks.items.tasks || new Array());
  const totalPages = useSelector(state => state.tasks.tasks.totalPages);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);

  useEffect(() => {
    dispatch(fetchTasks(search, page, pageSize));
  }, [search, page, pageSize, dispatch]);

  const handleAddTask = async (task) => {
    dispatch(addTask(task));
  };

  const handleDeleteTask = async (taskId) => {
    dispatch(deleteTask(taskId));
  };

  return (
    <div>
      <h2>Task List</h2>
      <input
        type="text"
        placeholder="Search tasks"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      
        {
          tasks.map((task, index) => (
            <TaskItem key={index} task={task} onDelete={handleDeleteTask} />
          ))
        }
  
      <TaskForm onAddTask={handleAddTask} />
      <div>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
};

export default TaskList;
