import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, addTask, deleteTask, setCurrentPage, selectTasks, selectTotalPages, selectCurrentPage, getCurrentState } from '../features/tasks/tasksSlice';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';

const TaskList = () => {
  const dispatch = useDispatch();
  const tasks = useSelector(selectTasks);
  const totalPages = useSelector(selectTotalPages);
  const currentPage = useSelector(selectCurrentPage);
  const status = useSelector(getCurrentState);
  const [search, setSearch] = useState('');
  const [pageSize] = useState(10);

  useEffect(() => {
    dispatch(fetchTasks(search, currentPage, pageSize));
  }, [search, currentPage, pageSize, dispatch]);

  const handleAddTask = async (task) => {
    await dispatch(addTask(task));
    dispatch(fetchTasks(search, currentPage, pageSize)); // Refresh current page tasks
  };


  const renderPageButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button key={i} onClick={() => dispatch(setCurrentPage(i))} disabled={i === currentPage}>
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div>
      {status === 'loading' && <p>Loading...</p>}

      <h2>Task List</h2>
      <input
        type="text"
        placeholder="Search tasks"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {tasks.map((task, index) => (
        <TaskItem key={index} task={task} search={search} currentPage={currentPage} pageSize={pageSize}/>
      ))}

      <TaskForm onAddTask={handleAddTask} />
      <div>
        {renderPageButtons()}
      </div>
    </div>
  );
};

export default TaskList;

