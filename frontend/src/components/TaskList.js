import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Grid, Input, Modal } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, addTask, setCurrentPage, selectTasks, selectTotalPages, selectCurrentPage, getCurrentState, selectSearchResults, clearAllPages } from '../features/tasks/tasksSlice';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';

const TaskList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // If log in expired navigate to home page and clear local storage.
  useLayoutEffect(() => {
    if (localStorage.getItem('token') && localStorage.getItem('expiresAt')) {
      if (new Date() > localStorage.getItem('expiresAt')) {
        handleLogOut();
      }
    }
  }, [])

  const searchResults = useSelector(selectSearchResults);
  const totalPages = useSelector(selectTotalPages);
  const currentPage = useSelector(selectCurrentPage);

  const [sortBy, changeSortBy] = useState('latest');
  const tasks = useSelector((state) => selectTasks(state, currentPage, sortBy));

  const status = useSelector(getCurrentState);
  const [search, setSearch] = useState('');
  const [searchPage, setSearchPage] = useState(1);
  const [pageSize] = useState(3);
  const [modalOpen, setModalOpen] = useState(false);
  const [taskUpdated, setTasksUpdated] = useState(false);

  useEffect(() => {
    if (search.length > 0) {
      dispatch(fetchTasks(search, 1, 1,));
    } else {
      dispatch(fetchTasks(search, currentPage, pageSize, sortBy));
    }

    if (taskUpdated) setTasksUpdated(false);

  }, [search, currentPage, sortBy, taskUpdated]);

  const activateAddTask = () => {
    setModalOpen(true);
  };

  const toggleSort = async () => {
    changeSortBy(sortBy === 'latest' ? 'oldest' : 'latest')
  }

  const handleAddTask = async (task) => {
    setModalOpen(false);
    await dispatch(addTask(task));
    await dispatch(fetchTasks(search, currentPage, pageSize, sortBy));
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
        <TaskItem task={task} search={search} currentPage={currentPage} pageSize={pageSize} setTasksUpdated={setTasksUpdated} />
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


  const handleLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresAt');
    dispatch(clearAllPages())
    navigate('/');
  }

  return (
    <>
    <Grid>
      {status === 'loading' && <p>Loading...</p>}
      <Grid columns={4} stackable>
        <Grid.Column>
          <Button onClick={toggleSort} disabled={search.length > 0}>Sort by {sortBy === 'latest' ? 'oldest' : 'latest'}</Button>
        </Grid.Column>
        <Grid.Column>
          <Input
            type="text"
            placeholder="Search tasks"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSearchPage(1); // Reset search page to 1 on new search
            }}
          />
        </Grid.Column>
        <Grid.Column>
          <Button positive onClick={activateAddTask}>ADD TASK</Button>
        </Grid.Column>
        <Grid.Column>
          <Button negative onClick={handleLogOut}>
            Log out
          </Button>
        </Grid.Column>
      </Grid>

    </Grid>
    <Grid centered>
      {search ? renderSearchTasks() : renderTasks()}
      <Grid.Row>
        {search.length > 0 ? renderSearchPageButtons() : renderPageButtons()}
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