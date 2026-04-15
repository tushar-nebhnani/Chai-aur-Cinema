// Server entrypoint for standalone deployments and environment setup.

import "dotenv/config";
import app from "./src/server/app.js";
import initializeDatabase from "./src/server/common/db/init-db.js";

const PORT = process.env.PORT || 3000;

try {
  app.listen(PORT, async () => {
    await initializeDatabase();
    console.log(`Server is running at port ${PORT} ...`);
  });
} catch (error) {
  console.error("Error while starting the server", error);
}
