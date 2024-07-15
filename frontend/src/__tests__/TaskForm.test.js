import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import this to enable the custom matchers
import TaskForm from '../components/TaskForm.js';

describe('TaskForm Component', () => {
  const onAddTaskMock = jest.fn();

  beforeEach(() => {
    onAddTaskMock.mockClear();
  });

  test('renders the form', () => {
    render(<TaskForm onAddTask={onAddTaskMock} />);
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByText(/add task/i)).toBeInTheDocument();
  });

  test('handles input changes', () => {
    render(<TaskForm onAddTask={onAddTaskMock} />);
    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);

    fireEvent.change(titleInput, { target: { value: 'New Task Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'New Task Description' } });

    expect(titleInput.value).toBe('New Task Title');
    expect(descriptionInput.value).toBe('New Task Description');
  });

  test('does not submit the form if title or description is missing', () => {
    render(<TaskForm onAddTask={onAddTaskMock} />);
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();

    const submitButton = screen.getByText(/add task/i);
    
    // Attempt to submit with both fields empty
    fireEvent.click(submitButton);
    expect(alertMock).toHaveBeenCalledWith('Please fill in both fields');
    expect(onAddTaskMock).not.toHaveBeenCalled();

    const titleInput = screen.getByLabelText(/title/i);
    fireEvent.change(titleInput, { target: { value: 'New Task Title' } });
    
    // Attempt to submit with only the title filled
    fireEvent.click(submitButton);
    expect(alertMock).toHaveBeenCalledWith('Please fill in both fields');
    expect(onAddTaskMock).not.toHaveBeenCalled();

    alertMock.mockRestore();
  });

  test('submits the form correctly when both fields are filled', () => {
    render(<TaskForm onAddTask={onAddTaskMock} />);
    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByText(/add task/i);

    fireEvent.change(titleInput, { target: { value: 'New Task Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'New Task Description' } });

    fireEvent.click(submitButton);

    expect(onAddTaskMock).toHaveBeenCalledWith({
      title: 'New Task Title',
      description: 'New Task Description',
      status: 'active'
    });

    expect(titleInput.value).toBe('');
    expect(descriptionInput.value).toBe('');
  });
});
