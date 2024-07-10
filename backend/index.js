import express from 'express';
import bodyParser from 'body-parser';
import { connectDB } from './mongodb.js';

const app = express();

app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    await connectDB(); 
    console.log(`Server running on port ${PORT}`);
});

