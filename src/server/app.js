import express from "express";
import cors from "cors";
import routes from "./app.routes.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", 1);

// 💡 1. Dynamic CORS: Allows your local frontend AND your Vercel frontend
const allowedOrigins = [
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "http://localhost:3000",
  "https://chai-aur-cinema-pwv8.vercel.app", // 👈 Add your exact Vercel frontend URL here!
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// 💡 2. The Health Check Route (Fixes the Vercel 404 on the homepage)
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🎬 Chai Aur Cinema API is Live on Vercel!",
    environment: process.env.NODE_ENV,
  });
});

// Your main routing architecture
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
      // Ensure initializeDatabase is imported at the top if you use it here locally!
      // await initializeDatabase();
      console.log(`Server is running at port ${PORT} ...`);
    });
  }
} catch (error) {
  console.error("Error while starting the server", error);
}

// Export for Vercel
export default app;
