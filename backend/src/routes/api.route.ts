import { Router, Request, Response } from "express";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

import crypto from "crypto";

import pool from "../database.js";

const router = Router();

function generate6DigitNumber() {
  return Math.floor(100000 + Math.random() * 900000);
}

// For SignUp page
router.post('/create-user', async (req: Request, res: Response) => {
    try {
        const { values } = req.body;

        if (!values.email) {
            return res.status(400).send("Email is required");
        }

        // check if user exists
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [values.email]);

        if (existingUser.rows.length > 0) {
            return res.status(409).send("User with this email already exists.");
        }

        const randomUID = crypto.randomUUID();
        const otp = generate6DigitNumber();
        const otpExpiration = new Date(Date.now() + 10 * 60 * 1000);

        // Store new users
        const newUser = await pool.query(
            'INSERT INTO users (user_id, email, otp, otp_expires_at) VALUES ($1, $2, $3, $4) RETURNING *',
            [randomUID, values.email, otp, otpExpiration]
        );

        const mailerSend = new MailerSend({
            apiKey: process.env.MAILER_SEND_API_TOKEN as string,
        });

        // FIX 3: Use a full email address for the sender
        const sentFrom = new Sender("info@test-r9084zv9v2egw63d.mlsender.net", "Task Flow");

        const recipients = [
            new Recipient(values.email)
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

router.post('/verify-otp', async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;

        if (!otp || !email) {
            return res.status(400).send({ message: "6 digits are required" });
        }

        const verifyOtp = await pool.query(`SELECT otp FROM users WHERE email = $1`, [email]);

        if (verifyOtp.rows[0].otp !== otp) {
            return res.status(400).send("Invalid OTP");
        }

        return res.status(200).send("Verification Successfull");

    } catch (error) {
        console.error("Failed to verify otp ", error);
    }

});

export default router;