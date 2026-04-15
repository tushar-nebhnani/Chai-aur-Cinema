import pg from "pg";
import "dotenv/config";
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DB_URI,
  max: 20,
  idleTimeoutMillis: 30000,
});

pool.on("connect", () => {
  console.log("✅ Connected to the BookMyShow Database Pool");
});

pool.on("error", (err) => {
  console.error("❌ Unexpected error on idle client", err);
});

export default pool;
