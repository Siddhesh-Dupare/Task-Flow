import express, { Express, Request, Response } from 'express';
import dotenv from "dotenv";
import cors from "cors";

import 'dotenv/config';

import { usersTable } from './tables/tables.js';
import apiRoutes from "./routes/api.route.js";
dotenv.config();

const app: Express = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from TypeScript Backend! 👋');
});


app.use('/api', apiRoutes);

const startServer = async () => {
    try {
        await usersTable();

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.log('Failed to start server', err);
    }
};

startServer();