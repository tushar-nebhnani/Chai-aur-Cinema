import express from "express";
import cors from "cors";
import routes from "./app.routes.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://127.0.0.1:5500",

    credentials: true,
  }),
);
app.use("/bookmyshow", routes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error("[GlobalError]", {
    status: statusCode,
    message: err.message,
    stack: err.stack,
  });
  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

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

export default app;
