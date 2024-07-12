import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
const __dirname = path.resolve();

import { connectDB } from './mongodb.js';

import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Serve the static files from the React app
const reactAppPath = path.join(__dirname, '../frontend/build/');
app.use(express.static(reactAppPath));

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running on port ${PORT}`);
});
