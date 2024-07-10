import express from 'express';
import bodyParser from 'body-parser';
import { connectDB } from './mongodb.js';

import authRoutes from './routes/authRoutes.js';

const app = express();

app.use(bodyParser.json());

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running on port ${PORT}`);
});
