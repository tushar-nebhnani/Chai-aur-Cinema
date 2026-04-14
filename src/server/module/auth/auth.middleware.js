import jwt from "jsonwebtoken";
import pool from "../../common/db/db.config.js";
import APIError from "../../common/utils/api.error.js";

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      throw APIError.notAuthorised("Access token not found in the cookie.");
    }

    const decodePayLoad = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY);
    req.user = decodePayLoad;

    // Work on the verify email service

    // const result = await pool.query(
    //   "SELECT is_verified FROM users WHERE user_id = $1",
    //   [decodePayLoad.id],
    // );
    // const liveUser = result.rows[0];

    // if (!liveUser) {
    //   throw APIError.badRequest("User no longer exists.");
    // }

    // if (liveUser.is_verified === false) {
    //   throw APIError.notAuthorised(
    //     "Please verify your email to access this feature.",
    //   );
    // }

    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);

    if (error.name === "TokenExpiredError") {
      next(
        APIError.badRequest("Your session has expired. Please log in again."),
      );
    } else if (error.name === "JsonWebTokenError") {
      next(APIError.badRequest("Invalid authentication token."));
    } else {
      next(error); // Passes the custom APIError or DB errors to your global handler
    }
  }
};

export default verifyToken;
