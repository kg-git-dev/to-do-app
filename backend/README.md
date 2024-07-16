# Frontend (ReactJS)
The application initializes an express server that connects to a mongodb database and performs GET/POST/PUT/DELETE actions. 

### External Dependencies
* mongodb
The application uses local instance of mongodb. Mongodb must be initialized in the hosting computer. 
* .env files
Production files use .env while test files use test.env. Environment files not available in the repo and must be requested. sample.env attached as a reference for available keys:
- MONGO_URI=mongodb://local-mongo-uri
- PORT=3000 
- JWT_SECRET=random-jwt-secret

## Installing

* Initialize dependencies with `npm i`

## Executing program

```
npm start
```

## Test Cases
* Available at ```./__tests__/```.
To run test cases:
```
npm test
```
Index for test cases is located at ```./test.index.js```. 
For integrated testing I wanted to test response from mongodb instead of a mock or virtual database. Since we already have a mongodb server initialized, test cases connect to the existing db, creates a new database, make modifications and deletes database on complete.
test.index.js is similar to index.js with the difference being a new express server is initialized at port 3001 and closed on test complete.

## Available Routes:
* POST /auth/register: Register a new user. Username cannot be empty spaces and must be at least 1 character. Password must be atleast 8 characters. Disallow duplicate users.
* POST /auth/login: Authenticate a user. Returns a jtw encrypted token and its expiry date.
* GET /tasks: Retrieve a list of tasks with support for pagination, search, and sorting.
For search, creating another route might have been better. But per requirements I have set it up as such that it runs completely different queries depending on whether a search value is passed.
* POST /tasks: Create a new task. 
* PUT /tasks/{id}: Update an existing task. 
* DELETE /tasks/{id}: Delete a task.
 
## Protected Routes:
All routes except /auth/register and auth/login are passed through a middleware.
Middleware function here: ```./middleware/authMiddleware```
The middleware checks for a valid jwt encrypted token attached to the request header.






