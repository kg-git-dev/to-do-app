import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import TaskList from './components/TaskList';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/tasks-list" element={<TaskList />} />
      </Routes>
    </div>
  );
}

export default App;
