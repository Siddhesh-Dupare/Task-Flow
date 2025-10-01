import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from "dotenv";
import cors from "cors";
import passport from 'passport';
import session from 'express-session';

import { usersTable } from './tables/tables.js';
import apiRoutes from "./routes/api.route.js";
dotenv.config();

const app: Express = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'a_default_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(passport.initialize());
app.use(passport.session());

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