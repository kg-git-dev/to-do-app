// src/components/TaskList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/tasks?search=${search}&page=${page}&limit=${pageSize}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Response:', response.data); // Debugging response
        if (response.data) {
          setTasks(response.data);
          setTotalPages(5);
          console.log('Tasks set:', response.data); // Debugging tasks setting
        } else {
          setTasks([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error); // Improved error logging
        alert('Error fetching tasks.');
      }
      setLoading(false);
    };

    fetchTasks();
  }, [search, page, pageSize]);

  const handleAddTask = async (task) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/tasks', task, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks([...tasks, response.data]);
      console.log('Task added:', response.data); // Debugging added task
    } catch (error) {
      console.error('Error adding task:', error); // Improved error logging
      alert('Error adding task');
    }
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
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <ul>
          {tasks.length === 0 ? (
            <p>No tasks found</p>
          ) : (
            tasks.map((task) => (
              <TaskItem key={task._id} task={task} />
            ))
          )}
        </ul>
      )}
      <TaskForm onAddTask={handleAddTask} />
      <div>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
};

export default TaskList;
