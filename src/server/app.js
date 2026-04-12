import express from "express";
import cors from "cors";
import routes from "./app.routes.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/bookmyshow", routes);

app.post("/bookmyshow/register", (req, res) => {
  res.send("Registered successfully!");
});

export default app;
