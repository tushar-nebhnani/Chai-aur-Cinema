import APIError from "../../../common/utils/api.error.js";
import pool from "../../../common/db/db.config.js";
import PasswordUtils from "../../../common/utils/password.utils.js";
import JWTtokens from "../../../common/utils/jwt.utils.js";
import NotificationService from "../../../common/notification-service/notification.service.js";

const loginService = async (email, password, device = "Unknown device") => {
  try {
    const sql = `SELECT * FROM users WHERE email=$1`;
    const result = await pool.query(sql, [email]);
    const user = result.rows[0];

    if (!user) {
      throw APIError.notAuthorised("Invalid email or password. User not found");
    }

    const isPasswordValid = await PasswordUtils.compare(
      password,
      user.password_hash,
    );
    if (!isPasswordValid) {
      throw APIError.notAuthorised(
        "Password incorrect. Please enter the password again.",
      );
    }

    const payload = {
      id: user.user_id,
      email: user.email,
    };

    const token = JWTtokens.generateAccessToken(payload);

    NotificationService.sendLoginAlert(user.email, user.full_name);

    return {
      token,
      user: {
        id: user.user_id,
        name: user.full_name,
        email: user.email,
      },
    };
  } catch (error) {
    console.error("Login service", error);

    if (error instanceof APIError) throw error;
    throw APIError.serverError("Server failed during login.");
  }
};

export default loginService;
