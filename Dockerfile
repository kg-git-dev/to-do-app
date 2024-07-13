# Stage 1: Build the React app
FROM node:22 AS build

# Set working directory
WORKDIR /app

# Copy frontend source code
COPY frontend ./frontend

# Install frontend dependencies and build the frontend
WORKDIR /app/frontend
RUN npm install
RUN npm run build

# Stage 2: Set up the backend with built frontend
FROM node:22 

# Set working directory
WORKDIR /app

# Copy the backend source code
COPY backend ./backend

# Copy the built frontend code to the backend public directory
COPY --from=build /app/frontend/build ./backend/public

# Install backend dependencies
WORKDIR /app/backend
RUN npm install

# Expose the port the app runs on
EXPOSE 3000

# Start the backend server
CMD ["node", "index.js"]
