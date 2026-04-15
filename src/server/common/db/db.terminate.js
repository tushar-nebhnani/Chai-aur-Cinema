// This file can only be ran by the admin in terminal. We are not supposed to even try to run this file as it will completly delete the database
import "dotenv/config";
import pg from "pg";

const pool = new pg.Pool({
  user: "tushar",
  host: "localhost", // or 127.0.0.1
  database: "bookmyshowDb",
  password: "mahadev@1234", // No encoding needed here!
  port: 5432,
});
const dropAllTables = async () => {
  try {
    console.log("Starting database teardown...");

    // DROP TABLE IF EXISTS prevents errors if the script is run multiple times.
    // CASCADE ensures that any foreign key dependencies are safely ignored during the drop.
    await pool.query(`
        DROP TABLE IF EXISTS 
            bookings, 
            seats, 
            shows, 
            users 
        CASCADE;
    `);

    console.log("✅ All tables dropped successfully.");
    console.log("🧨 Database is completely wiped and ready for a fresh start.");
  } catch (error) {
    console.error("❌ Error dropping tables:", error);
    process.exit(1);
  }
};

dropAllTables();
