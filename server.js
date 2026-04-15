import "dotenv/config";
import app from "./src/server/app.js";
import initializeDatabase from "./src/server/common/db/init-db.js";

try {
  if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, async () => {
      await initializeDatabase();
      console.log(`Server is running at port ${PORT} ...`);
    });
  }
} catch (error) {
  console.error("Error while starting the server", error);
}
