import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from "dotenv";
import cors from "cors";
import passport from 'passport';
import session from 'express-session';
import { Strategy as LocalStorage} from 'passport-local';
import bcrypt from 'bcrypt';

import 'dotenv/config';

import { usersTable } from './tables/tables.js';
import apiRoutes from "./routes/api.route.js";
import pool from './database.js';
dotenv.config();

const app: Express = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173'
}));

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

interface User {
    id: number;
    username: string;
    password: string;
}

declare global {
    namespace Express {
        export interface Request {
            user?: User;
        }
    }
}

passport.use(new LocalStorage(
    async (username, password, done) => {
        try {
            const result = await pool.query<User>('SELECT * FROM users WHERE user_id = $1', [username]);
            const user = result.rows[0];

            if (!user) {
                return done(null, false, { message: 'Incorrect username.'});
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        const user = result.rows[0];
        done(null, user);
    } catch (error) {
        done(error);
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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