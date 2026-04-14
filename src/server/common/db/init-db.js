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

    // 2. Movies Table (NEW: What are they watching?)
    await pool.query(`
        CREATE TABLE IF NOT EXISTS movies (
            movie_id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            language VARCHAR(50) NOT NULL,
            genre VARCHAR(100),
            duration_mins INTEGER NOT NULL
        )
    `);
    console.log("✅ Movies table created.");

    // 3. Theaters & Screens (NEW: Where are they watching it?)
    await pool.query(`
        CREATE TABLE IF NOT EXISTS theaters (
            theater_id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            city VARCHAR(100) NOT NULL
        )
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS screens (
            screen_id SERIAL PRIMARY KEY,
            theater_id INTEGER REFERENCES theaters(theater_id) ON DELETE CASCADE,
            screen_name VARCHAR(50) NOT NULL,
            total_capacity INTEGER NOT NULL
        )
    `);
    console.log("✅ Theaters & Screens tables created.");

    // 4. Showtimes Table (Replaces your 'shows' table)
    await pool.query(`
        CREATE TABLE IF NOT EXISTS showtimes (
            showtime_id SERIAL PRIMARY KEY,
            movie_id INTEGER REFERENCES movies(movie_id) ON DELETE CASCADE,
            screen_id INTEGER REFERENCES screens(screen_id) ON DELETE CASCADE,
            start_time TIMESTAMP NOT NULL,
            base_price DECIMAL(10, 2) NOT NULL
        )
    `);
    console.log("✅ Showtimes table created.");

    // 5. Seats Table (Your concept, updated to link to showtimes)
    await pool.query(`
        CREATE TABLE IF NOT EXISTS seats (
            seat_id SERIAL PRIMARY KEY,
            showtime_id INTEGER REFERENCES showtimes(showtime_id) ON DELETE CASCADE,
            seat_number VARCHAR(10) NOT NULL, -- e.g., 'A1', 'B5'
            is_booked BOOLEAN DEFAULT FALSE,
            UNIQUE(showtime_id, seat_number) 
        )
    `);
    console.log("✅ Seats table created.");

    // 6. Bookings Table (UPGRADED: Now handles Payments & Invoicing)
    await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings (
            booking_id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(user_id),
            showtime_id INTEGER REFERENCES showtimes(showtime_id),
            total_amount DECIMAL(10, 2) NOT NULL,
            payment_status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, SUCCESS, FAILED
            transaction_id VARCHAR(255), -- For Razorpay/Stripe ID
            booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    console.log("✅ Bookings table created.");

    // 7. Booking_Seats Mapping (NEW: Allows 1 booking to have multiple seats!)
    await pool.query(`
        CREATE TABLE IF NOT EXISTS booking_seats (
            id SERIAL PRIMARY KEY,
            booking_id INTEGER REFERENCES bookings(booking_id) ON DELETE CASCADE,
            seat_id INTEGER REFERENCES seats(seat_id)
        )
    `);
    console.log("✅ Booking-Seats mapping created.");

    console.log("🎉 Database setup complete!");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    process.exit(1);
  }
};

export default initializeDatabase;
