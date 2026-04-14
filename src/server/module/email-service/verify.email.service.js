import crypto from "crypto";
import pool from "../../../common/db/db.config.js";
import APIError from "../../../common/utils/api.error.js";
import NotificationService from "../../../common/utils/notification.service.js";

const verifyEmailService = async (rawToken) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const userResult = await pool.query(
    `SELECT user_id, email, full_name 
     FROM users 
     WHERE verification_token = $1 AND token_expiry > NOW()`,
    [hashedToken],
  );

  const user = userResult.rows[0];

  if (!user) {
    throw APIError.badRequest(
      "Invalid or expired verification token. Your account may already be verified.",
    );
  }

  await pool.query(
    `UPDATE users 
     SET is_verified = true, 
         verification_token = NULL 
     WHERE user_id = $1`,
    [user.user_id],
  );

  NotificationService.sendWelcome(user.email, user.full_name);

  return {
    success: true,
    message: "Email successfully verified. You can now log in.",
  };
};

export default verifyEmailService;
