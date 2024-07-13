import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
const __dirname = path.resolve();

dotenv.config();

import { connectDB } from './mongodb.js';

import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Serve tatic files from the React app
const reactAppPath = path.join(__dirname, 'public');
app.use(express.static(reactAppPath));

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// Fallback route to serve the index.html file for any other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(reactAppPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running on port ${PORT}`);
});
