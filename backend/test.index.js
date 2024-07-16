// test.index.js
import express from 'express';
import bodyParser from 'body-parser';
import { connectDB } from './mongodb.js';

import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();

app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

const PORT = process.env.PORT || 3001;

export const startServer = async () => {
  await connectDB(); 
  return new Promise((resolve, reject) => {
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      resolve(server);
    });
  });
};
