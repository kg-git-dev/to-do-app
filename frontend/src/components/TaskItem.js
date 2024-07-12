// src/components/TaskItem.js
import React from 'react';
import axios from 'axios';
import { Card } from 'semantic-ui-react'

const TaskItem = ({ task }) => {
    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/tasks/${task._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Task deleted successfully');
            // Refresh the task list or remove the task from the state
        } catch (error) {
            alert('Error deleting task');
        }
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
                <button onClick={handleDelete}>Delete</button>
                <button>Edit</button>
            </Card.Content>
        </Card>
    );
};

export default TaskItem;
