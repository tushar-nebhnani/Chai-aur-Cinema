// any changes in the schema after the init-DB has completed. So, we won't modify our init-db we will modify the stuff from here as once the db is up and running we don't change the schema again n again.
// src/server/scripts/001-remove-token-version.js
import { run } from "../db.config.js";
const runMigration = async () => {
  try {
    console.log(
      'Running migration 001: Removing "token_version" column from users...',
    );

    // SQLite version 3.35.0+ supports dropping columns directly!
    const sql = `ALTER TABLE users DROP COLUMN token_version`;

    await run(sql);

    console.log(
      '✅ Migration successful! The "token_version" column has been deleted.',
    );

    // Safely exit the script
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error.message);

    // If you get a syntax error here, your SQLite version might be very old.
    // But with modern Node.js, this will work perfectly.
    process.exit(1);
  }
};

// Execute the migration
runMigration();
