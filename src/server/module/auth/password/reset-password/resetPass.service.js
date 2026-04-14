import crypto from "crypto";
import pool from "../../../../common/db/db.config.js";
import APIError from "../../../../common/utils/api.error.js";
import PasswordUtils from "../../../../common/utils/password.utils.js";
import NotificationService from "../../../../common/notification-service/notification.service.js";

const resetPassService = async (rawToken, newPassword) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const userResult = await pool.query(
      `SELECT user_id, email, full_name 
       FROM users 
       WHERE reset_token = $1 AND token_expiry > NOW()`,
      [hashedToken],
    );

    const user = userResult.rows[0];

    if (!user) {
      throw APIError.notAuthorised(
        "Token is invalid or has expired. Please request a new password reset.",
      );
    }

    const newHashedPassword = await PasswordUtils.hash(newPassword);

    await pool.query(
      `UPDATE users 
       SET password_hash = $1, 
           reset_token = NULL, 
           token_expiry = NULL 
       WHERE user_id = $2`,
      [newHashedPassword, user.user_id],
    );

    NotificationService.sendPasswordReset(user.email, user.full_name);

    console.info(
      "[ResetPassService] Password reset completed for user:",
      user.email,
    );

    return true;
  } catch (error) {
    console.error("[ResetPassService] Error resetting password:", error);
    throw error;
  }
};

export default resetPassService;
