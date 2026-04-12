// All the table creating of files goes here: This file is only supposed to do major schema changes in the DB for any manipulation we will use the scripts folder
import pool from "./db.config.js";

const initializeDatabase = async () => {
  try {
    console.log("Starting database initialization...");

    // 1. Users Table
    // Converted AUTOINCREMENT to SERIAL, DATETIME to TIMESTAMP
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            user_id SERIAL PRIMARY KEY,
            full_name VARCHAR(255),
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            is_verified BOOLEAN DEFAULT FALSE,
            reset_token TEXT,
            token_expiry TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    console.log("✅ Users table created.");

    // 2. Shows Table
    // Converted to SERIAL and TIMESTAMP
    await pool.query(`
        CREATE TABLE IF NOT EXISTS shows (
            show_id SERIAL PRIMARY KEY,
            event_name VARCHAR(255) DEFAULT 'Main Event',
            start_time TIMESTAMP NOT NULL
        )
    `);
    console.log("✅ Shows table created.");

    // 3. Seats Table
    // Standardized seat_number to VARCHAR
    await pool.query(`
        CREATE TABLE IF NOT EXISTS seats (
            seat_id SERIAL PRIMARY KEY,
            show_id INTEGER REFERENCES shows(show_id) ON DELETE CASCADE,
            seat_number VARCHAR(10) NOT NULL,
            is_booked BOOLEAN DEFAULT FALSE,
            booked_by INTEGER REFERENCES users(user_id),
            UNIQUE(show_id, seat_number) 
        )
    `);
    console.log("✅ Seats table created.");

    // 4. Bookings Table
    // Converted to SERIAL and TIMESTAMP
    await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings (
            booking_id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(user_id),
            seat_id INTEGER REFERENCES seats(seat_id),
            show_id INTEGER REFERENCES shows(show_id),
            booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    console.log("✅ Bookings table created.");

    console.log("🎉 Database setup complete!");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    process.exit(1); // immediately stops all the process
  }
};

export default initializeDatabase;
