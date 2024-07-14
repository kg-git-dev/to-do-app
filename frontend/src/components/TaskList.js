import React, { useEffect, useState } from 'react';
import { Grid, Input, Modal } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, addTask, setCurrentPage, selectTasks, selectTotalPages, selectCurrentPage, getCurrentState, selectSearchResults } from '../features/tasks/tasksSlice';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';

const TaskList = () => {
  const dispatch = useDispatch();
  const tasks = useSelector(selectTasks);
  const searchResults = useSelector(selectSearchResults);
  const totalPages = useSelector(selectTotalPages);
  const currentPage = useSelector(selectCurrentPage);
  const status = useSelector(getCurrentState);
  const [search, setSearch] = useState('');
  const [searchPage, setSearchPage] = useState(1);
  const [pageSize] = useState(3);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (search.length > 0) {
      dispatch(fetchTasks(search));
    } else {
      dispatch(fetchTasks(search, currentPage, pageSize));
    }
  }, [search, currentPage, dispatch]);

  const activateAddTask = () => {
    setModalOpen(true);
  };

  const handleAddTask = async (task) => {
    setModalOpen(false);
    await dispatch(addTask(task));
    await dispatch(fetchTasks(search, currentPage, pageSize));
  };

  const renderPageButtons = () => {
    if (search) return null; // Don't render page buttons when searching

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

  const renderSearchPageButtons = () => {
    if (!search) return null; // Only render search page buttons when searching

    const searchTotalTasks = searchResults[search]?.totalTasks || 0;
    const searchTotalPages = Math.ceil(searchTotalTasks / pageSize);
    const buttons = [];
    for (let i = 1; i <= searchTotalPages; i++) {
      buttons.push(
        <button key={i} onClick={() => setSearchPage(i)} disabled={i === searchPage}>
          {i}
        </button>
      );
    }
    return buttons;
  };

  const renderTasks = () => {
    return tasks.map((task, index) => (
      <Grid.Row key={index}>
        <TaskItem task={task} search={search} currentPage={currentPage} pageSize={pageSize} />
      </Grid.Row>
    ));
  };

  const renderSearchTasks = () => {
    const results = searchResults[search] || [];
    const searchTasks = [];
    const startIndex = (searchPage - 1) * pageSize;
    const endIndex = searchPage * pageSize;

    for (let i = startIndex; i < endIndex && i < results.length; i++) {
      searchTasks.push(results[i]);
    }

    return searchTasks.map((task, index) => (
      <Grid.Row key={index}>
        <TaskItem task={task} search={search} />
      </Grid.Row>
    ));
  };
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
            onChange={(e) => {
              setSearch(e.target.value);
              setSearchPage(1); // Reset search page to 1 on new search
            }}
          />
          <button onClick={activateAddTask} style={{ marginLeft: '30px' }}>ADD TASK</button>
        </Grid.Row>
        {search ? renderSearchTasks() : renderTasks()}
        <Grid.Row>
          {search.length > 0? renderSearchPageButtons() : renderPageButtons()}
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
