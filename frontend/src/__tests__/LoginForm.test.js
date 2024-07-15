import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

// Mock axios
jest.mock('axios');

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('LoginForm', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle user registration', async () => {
    axios.post.mockResolvedValueOnce({ data: {} });
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByText('Register'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/auth/register', { username: 'testuser', password: 'password' });
      expect(window.alert).toHaveBeenCalledWith('User registered successfully!');
    });
  });

  it('should handle user login', async () => {
    const token = 'test-token';
    const expiresAt = new Date().getTime() + 3600 * 1000; // 1 hour from now
    axios.post.mockResolvedValueOnce({ data: { token, expiresAt } });

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/auth/login', { username: 'testuser', password: 'password' });
      expect(localStorage.getItem('token')).toBe(token);
      expect(localStorage.getItem('expiresAt')).toBe(String(expiresAt));
      expect(mockNavigate).toHaveBeenCalledWith('/tasks-list');
    });
  });

  it('should redirect to tasks list if already logged in', () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('expiresAt', new Date().getTime() + 3600 * 1000); // 1 hour from now

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/tasks-list');
  });

  it('should show error message on registration failure', async () => {
    axios.post.mockRejectedValueOnce(new Error('Registration failed'));
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByText('Register'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Error registering user.');
    });
  });

  it('should show error message on login failure', async () => {
    axios.post.mockRejectedValueOnce(new Error('Login failed'));
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Error logging in.');
    });
  });
});
