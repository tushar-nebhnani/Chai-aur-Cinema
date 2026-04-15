import express from "express";
import cors from "cors";
import routes from "./app.routes.js";
import cookieParser from "cookie-parser";

const app = express();

// 1. Trust Proxy: Must be at the top for Vercel to see the real user IP
app.set("trust proxy", 1);

// 2. Single, Consolidated CORS Configuration
const allowedOrigins = [
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "http://localhost:3000",
  "https://chai-aur-cinema-cupp.vercel.app", // Your frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  }),
);

// 3. Body Parsers (Must come after CORS)
app.use(express.json());
app.use(cookieParser());

// 4. Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🎬 Chai Aur Cinema API is Live on Vercel!",
    environment: "production",
  });
});

// 5. Routes
app.use("/bookmyshow", routes);

// 6. Global Error Handler
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

// Local Development Listen
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT} ...`);
  });
}

export default app;
