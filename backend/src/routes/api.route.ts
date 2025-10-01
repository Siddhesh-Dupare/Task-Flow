import { Router, Request, Response, NextFunction } from "express";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

import crypto from "crypto";
import bcrypt from "bcrypt";

import pool from "../database.js";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

function generate6DigitNumber() {
  return Math.floor(100000 + Math.random() * 900000);
}

// For SignUp page
router.post('/create-user', async (req: Request, res: Response) => {

    console.log(req.body);
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).send("Email is required");
        }

        // check if user exists
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (existingUser.rows.length > 0) {
            return res.status(409).send("User with this email already exists.");
        }

        const randomUID = crypto.randomUUID();
        const otp = generate6DigitNumber();
        const otpExpiration = new Date(Date.now() + 10 * 60 * 1000);

        // Store new users
        const newUser = await pool.query(
            'INSERT INTO users (user_id, email, otp, otp_expires_at) VALUES ($1, $2, $3, $4) RETURNING *',
            [randomUID, email, otp, otpExpiration]
        );

        const mailerSend = new MailerSend({
            apiKey: process.env.MAILER_SEND_API_TOKEN as string,
        });

        // FIX 3: Use a full email address for the sender
        const sentFrom = new Sender("info@test-r9084zv9v2egw63d.mlsender.net", "Task Flow");

        const recipients = [
            new Recipient(email)
        ];

        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setReplyTo(sentFrom)
            .setSubject("Your Verification Code for Task Flow")
            .setHtml(`<strong>Your verification code is: ${otp}</strong>`)
            .setText(`Your verification code is: ${otp}`);
            
        try {
            await mailerSend.email.send(emailParams);

            const client = await pool.query("UPDATE users SET otp = $1, otp_expires_at = $2 WHERE user_id = $3", [otp, otpExpiration, newUser.rows[0].user_id]);

            // FIX 2: Send a single, combined success response
            return res.status(201).json({
                message: 'User created successfully and verification email sent.',
                user: newUser.rows[0]
            });

        } catch (emailError) {
            console.error("MailerSend Error: ", emailError);
            // The user was created, but the email failed to send.
            return res.status(201).json({
                message: 'User created successfully, but the verification email could not be sent. Please request a new code.',
                user: newUser.rows[0]
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Verify user OTP
router.post('/verify-otp', async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;

        if (!otp || !email) {
            return res.status(400).send({ message: "6 digits are required" });
        }

        const user = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

        if (user.rows[0].otp !== otp) {
            return res.status(400).send("Invalid OTP");
        }

        await pool.query(`UPDATE users SET otp = $1, otp_expires_at = $2, is_verified = $3 WHERE user_id = $4`, [null, null, true, user.rows[0].user_id]);

        return res.status(200).send("Verification Successfull");

    } catch (error) {
        console.error("Failed to verify otp ", error);
    }

});

// Account details
router.post('/account-details', async (req: Request, res: Response) => {
    console.log(req.body);
    try {
        const { email, name, password } = req.body;

        if (!email || !name || !password) {
            return res.status(400).send({ message: "name and password is required" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await pool.query(`UPDATE users SET full_name = $1, password = $2 WHERE email = $3`, [name, hashedPassword, email]);

        return res.status(200).send("Successfully Account is created");
    } catch (error) {
        console.error("Failed to create account", error);
    }
});

router.post('/projects', async (req: Request, res: Response) => {

    try {
        const { email, projectName, projectKey, boardType} = req.body;

        if (!email || !projectName || !projectKey || !boardType) {
        return res.status(400).json({ message: "App parameters are required" });
    }
        const user = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
        const workspace = await pool.query(`SELECT * FROM workspace WHERE owner_id = $1`, [user.rows[0].user_id]);

        await pool.query(`INSERT INTO projects (name, project_key, board_type, workspace_id, owner_id) VALUES ($1, $2, $3, $4, $5)`, [projectName, projectKey, boardType, workspace.rows[0].id, user.rows[0].user_id]);

        return res.status(200).json({ message: "Project successfully created" });
    } catch (error) {
        console.error("Failed to create project", error);
    }
});

// Site creation
router.post('/create-site', async (req: Request, res: Response) => {
    const { email, workspace } = req.body;

    if (!email || !workspace) {
        return res.status(400).send({ message: "Site name is essential" });
    }

    try {
        // If Existing site
        const existingOwnerId = await pool.query(`SELECT owner_id FROM workspace WHERE name = $1`, [workspace]);
        if (existingOwnerId.rows.length > 0) {
            return res.status(409).json({ message: "Site already exists." });
        }

        const workspaceSubdomain = workspace + 'workspace';

        const user = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

        const createWorkspace = await pool.query(`INSERT INTO workspace (name, subdomain, owner_id) VALUES ($1, $2, $3)`, [workspace, workspaceSubdomain, user.rows[0].user_id]);

        res.send(createWorkspace);

    } catch (error) {
        console.error("Failed to create site", error);
    }
});

export default router;