import "dotenv/config";
import app from "./src/server/app.js";

const PORT = process.env.PORT || 3000;

try {
  app.listen(PORT, async () => {
    console.log(`Server is running at port ${PORT} ...`);
  });
} catch (error) {
  console.error("Error while starting the server", error);
}
