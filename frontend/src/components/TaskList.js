import React, { useEffect, useState, createRef } from 'react';
import { Grid, Input, Modal, Button } from 'semantic-ui-react';
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
  const [pageSize] = useState(3);

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks(search, currentPage, pageSize));
  }, [search, currentPage, pageSize]);

  const handleAddTask = async (task) => {
    setModalOpen(false);
    await dispatch(addTask(task));
    await dispatch(fetchTasks(search, currentPage, pageSize)); 
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

  const activateAddTask = () => {
    setModalOpen(true);
  }

  return (
    <>
      <Grid centered>
        {status === 'loading' && <p>Loading...</p>}
        <Grid.Row style={{ marginTop: '20px' }}>
          <h2>Task List</h2>
        </Grid.Row>
        <Grid.Row>
          <Input
            type="text"
            placeholder="Search tasks"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={activateAddTask} style={{ marginLeft: '30px' }}>ADD TASK</button>

        </Grid.Row>
        {tasks.map((task, index) => (
          <Grid.Row key={index}>
            <TaskItem task={task} search={search} currentPage={currentPage} pageSize={pageSize} />
          </Grid.Row>
        ))}

        <Grid.Row>
          {renderPageButtons()}
        </Grid.Row>
      </Grid>
      <Modal
        size={"mini"}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <Modal.Header>Add Task</Modal.Header>
        <Modal.Content>
          <TaskForm onAddTask={handleAddTask} />
        </Modal.Content>
        <Modal.Actions>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default TaskList;

