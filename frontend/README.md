# Frontend (ReactJS)
The application uses redux thunk to make async api calls to the express server. 

## Getting Started

### External Dependencies

* ```../backend/``: node js express backend available at the root of this repo. 

### Installing

* Initialize dependencies with `npm i`

### Executing program

```
npm start
```

## Test Cases
* Available at ```./src/__tests__/```.
To run test cases:
```
npm test
```

## Components:
* ```./src/components/TaskList.js```: Displays a list of tasks, with pagination and search functionality. Sort by latest/oldest.
* ```./src/components/TaskItem.js```: Displays an individual task with options to edit, delete, and
mark as completed.
* ```./src/components/TaskForm.js```: Allows users to add a new task or edit an existing task,
including validation and error handling.
* ```./src/components/LoginForm.js```: Handles user registration, and login functionality.

## Software Logic:
* On successful log in request, the server returns a jwt token and the token's expiry time. This is stored in local storage for continued reference even after page refresh.
* All the backend routes except log in is passed through an aunthentication middleware that requires the token returned during login to be attached to the Authorization header.
* All the api requests are made in the slice at ```./src/features/tasks/tasksSlice```.
* The tasks reducer is responsible for storing tasks attached to page numbers and the sorting type. API call is made only once for each page.
* The tasks reducer is also responsible for storing search results. The search results have sorting disabled since it matches based on title and description. Sorting will skew the results. They are however paginated similar to all tasks. The results are saved in the reducer as an object with the search term as key. This means no duplicate API calls for the same search. 
* Log out functionality clears the local storage and reroutes to the homepage. Set up with React Router. 