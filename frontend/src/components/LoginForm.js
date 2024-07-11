import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:3000/auth/register', { username, password });
      alert('User registered successfully!');
    } catch (error) {
      alert('Error registering user.');
    }
  };

  const handleLogin = async () => {
    console.log('before response')

    try {
      const response = await axios.post('http://localhost:3000/auth/login', { username, password });
      console.log('after response', response)
      localStorage.setItem('token', response.data.token);
      navigate('/tasks');
    } catch (error) {
      alert('Error logging in.');
    }
  };

  return (
    <div>
      <h2>Login / Register</h2>
      <form>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="button" onClick={handleRegister}>Create</button>
        <button type="button" onClick={handleLogin}>Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
