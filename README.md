# To-do-app
Full stack application built with node js, mongo db, express and react redux.

## Run as a Docker container

* Initialize with `docker compose up` at root directory.

## Run in local environment
Please follow instructions set in ```./backend/README.md``` and ```./frontend/README.md```
Current set up at ./backend/index.js is configured for Docker. To run locally either change the directory from which react application is to be served or run frontend server with ```npm start```.

## Available Routes:
* POST /auth/register: Register a new user. Username cannot be empty spaces and must be at least 1 character. Password must be atleast 8 characters. Disallow duplicate users.
* POST /auth/login: Authenticate a user. Returns a jtw encrypted token and its expiry date.
* GET /tasks: Retrieve a list of tasks with support for pagination, search, and sorting.
* POST /tasks: Create a new task. 
* PUT /tasks/{id}: Update an existing task. 
* DELETE /tasks/{id}: Delete a task.
 
## Protected Routes:
All routes except /auth/register and auth/login are passed through a middleware.
The middleware checks for a valid jwt encrypted token attached to the request header.
Middleware available at ```./backend/middleware/authMiddleware```

## React Components:
* ```./frontend/src/components/TaskList```: Displays a list of tasks, with pagination and search functionality. Sort by latest/oldest.
* ```./frontend/src/components/TaskItem.js```: Displays an individual task with options to edit, delete, and
mark as completed.
* ```./frontend/src/components/TaskForm.js```: Allows users to add a new task or edit an existing task,
including validation and error handling.
* ```.frontend/src/components/LoginForm.js```: Handles user registration, and login functionality.





