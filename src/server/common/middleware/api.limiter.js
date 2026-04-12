import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per 15 minutes
  message: {
    success: false,
    message:
      "Too many attempts from this IP, please try again after 15 minutes.",
  },
  standardHeaders: true, // Returns rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disables the `X-RateLimit-*` headers
});

export default authLimiter;
