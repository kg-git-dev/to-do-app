import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Card, Modal, Form, Button } from 'semantic-ui-react';
import { fetchTasks, deleteTask, updateTask } from '../features/tasks/tasksSlice';

const TaskItem = ({ task, search, currentPage, pageSize, setTasksUpdated }) => {
    const dispatch = useDispatch();
    const isComplete = task.status === 'completed';
    const [modalOpen, setModalOpen] = useState(false);
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);

    const handleDeleteTask = async () => {
        try {
            await dispatch(deleteTask(task._id));
            alert('Task deleted successfully');
        } catch (err) {
            alert('Error deleting task: ', err);
        }
        setTasksUpdated(true)
    };

    const handleComplete = async () => {
        try {
            await dispatch(updateTask(task._id, { status: 'completed' }));
            alert("Task marked complete")

        } catch (err) {
            alert('Error completing task: ', err)
        }
        setTasksUpdated(true);
    };

    const handleEditTask = () => {
        setModalOpen(true);
    };

    const handleUpdateTask = async () => {
        try{
            await dispatch(updateTask(task._id, { title, description }));
            alert("Task updated");
        }catch(err){
            alert("Error updating task: ", err)
        }
        setTasksUpdated(true);
        setModalOpen(false);
    };

    return (
        <>
            <Card style={{ width: '500px' }}>
                <Card.Content>
                    <Card.Header>{task.title}</Card.Header>
                    <Card.Description>{task.description}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                    {task.status}
                </Card.Content>
                <Card.Content>
                    <button disabled={isComplete} onClick={handleComplete}>Complete</button>
                    <button onClick={handleDeleteTask}>Delete</button>
                    <button onClick={handleEditTask}>Edit</button>
                </Card.Content>
            </Card>
            <Modal
                size="mini"
                open={modalOpen}
                onClose={() => setModalOpen(false)}
            >
                <Modal.Header>Edit Task</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field>
                            <label>Title</label>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Form.Field>
                        <Button onClick={handleUpdateTask} positive>Update</Button>
                        <Button onClick={() => setModalOpen(false)} negative>Cancel</Button>
                    </Form>
                </Modal.Content>
            </Modal>
        </>
    );
};

export default TaskItem;