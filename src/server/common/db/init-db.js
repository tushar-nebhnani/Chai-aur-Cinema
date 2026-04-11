// All the table creating of files goes here: This file is only supposed to do major schema changes in the DB for any manipulation we will use the scripts folder
import { db } from "./db.config.js";

const initializeDatabase = async () => {
  try {
    console.log("Starting database initialization...");

    // 1. Users Table (Your original was perfectly SQLite!)
    await db.run(`
            CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                is_verified BOOLEAN DEFAULT FALSE,
                reset_token TEXT,
                token_expiry TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
    // console.log("✅ Users table created.");

    // 2. Shows Table (Changed SERIAL to INTEGER PRIMARY KEY AUTOINCREMENT, VARCHAR to TEXT)
    await db.run(`
            CREATE TABLE IF NOT EXISTS shows (
                show_id INTEGER PRIMARY KEY AUTOINCREMENT,
                event_name TEXT DEFAULT 'Main Event',
                start_time DATETIME NOT NULL
            )
        `);
    // console.log("✅ Shows table created.");

    // 3. Seats Table (Changed SERIAL to INTEGER, INT to INTEGER)
    await db.run(`
            CREATE TABLE IF NOT EXISTS seats (
                seat_id INTEGER PRIMARY KEY AUTOINCREMENT,
                show_id INTEGER REFERENCES shows(show_id) ON DELETE CASCADE,
                seat_number TEXT NOT NULL,
                is_booked BOOLEAN DEFAULT FALSE,
                booked_by INTEGER REFERENCES users(user_id),
                UNIQUE(show_id, seat_number) 
            )
        `);
    // console.log("✅ Seats table created.");

    // 4. Bookings Table (Changed SERIAL to INTEGER, INT to INTEGER)
    await db.run(`
            CREATE TABLE IF NOT EXISTS bookings (
                booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER REFERENCES users(user_id),
                seat_id INTEGER REFERENCES seats(seat_id),
                show_id INTEGER REFERENCES shows(show_id),
                booking_time DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
    // console.log("✅ Bookings table created.");

    console.log("🎉 Database setup complete!");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
  }
};

export default initializeDatabase;
