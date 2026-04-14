import jwt from "jsonwebtoken";
import pool from "../common/db/db.config.js"; // Needed for the DB check
import APIError from "../../common/utils/api.error.js";

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      throw APIError.unauthorized("Access token not found in the cookie.");
    }

    const decodePayLoad = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY);
    req.user = decodePayLoad;

    const result = await pool.query(
      "SELECT is_verified FROM users WHERE user_id = $1",
      [decodePayLoad.userId],
    );
    const liveUser = result.rows[0];

    if (!liveUser) {
      throw APIError.unauthorized("User no longer exists.");
    }

    if (liveUser.is_verified === false) {
      throw APIError.forbidden(
        "Please verify your email to access this feature.",
      );
    }

    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);

    if (error.name === "TokenExpiredError") {
      next(
        APIError.unauthorized("Your session has expired. Please log in again."),
      );
    } else if (error.name === "JsonWebTokenError") {
      next(APIError.unauthorized("Invalid authentication token."));
    } else {
      next(error); // Passes the custom APIError or DB errors to your global handler
    }
  }
};

export default verifyToken;
