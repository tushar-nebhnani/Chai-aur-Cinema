import express from "express";
import cors from "cors";
import routes from "./app.routes.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(
  cors({
    // 1. Explicitly name the frontend origin (No trailing slash!)
    origin: "http://127.0.0.1:5500",

    // 2. Explicitly allow credentials (cookies, authorization headers)
    credentials: true,
  }),
);
app.use(cookieParser());
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

export default app;
