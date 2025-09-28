import pool from "../database.js";

export const usersTable = async () => {
    const client = await pool.connect();

    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) UNIQUE NOT NULL,
                full_name VARCHAR(255),
                password VARCHAR(100),
                email VARCHAR(255),
                create_at TIMESTAMPTZ DEFAULT NOW(),
                otp VARCHAR(6),
                otp_expires_at TIMESTAMPTZ,
                is_verified BOOLEAN DEFAULT FALSE
            );
        `);

        console.log("Users table created");
    } catch (error) {
        console.error("Error occured: ", error);
    } finally {
        client.release();
    }
}
