// src/components/TaskItem.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Card } from 'semantic-ui-react'
import { fetchTasks, deleteTask } from '../features/tasks/tasksSlice';

const TaskItem = ({ task, search, currentPage, pageSize }) => {
    const dispatch = useDispatch();

    const handleDeleteTask = async () => {
        try {
            dispatch(deleteTask(task._id))
            alert('Task deleted successfully');

        } catch (error) {
            alert('Error deleting task');
        }
        
        await dispatch(fetchTasks(search, currentPage, pageSize)); 
      };

    const handleComplete = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3000/tasks/${task._id}`, { ...task, status: 'completed' }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Task marked as completed');
            // Refresh the task list or update the task status in the state
        } catch (error) {
            alert('Error marking task as completed');
        }
    };

    return (
        <Card>
            <Card.Content>
                <Card.Header>{task.title}</Card.Header>
                <Card.Description>{task.description}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                {task.status}
            </Card.Content>
            <Card.Content>
                <button onClick={handleComplete}>Complete</button>
                <button onClick={handleDeleteTask}>Delete</button>
                <button>Edit</button>
            </Card.Content>
        </Card>
    );
};

export default TaskItem;
