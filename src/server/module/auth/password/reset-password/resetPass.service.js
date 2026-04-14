import crypto from "crypto";
import pool from "../../../common/db/db.config.js";
import APIError from "../../../common/utils/api.error.js";
import PasswordUtils from "../../../common/utils/password.utils.js";
import { sendChangePasswordMail } from "../../../../common/mail-service/email.service.js";

const resetPassService = async (rawToken, newPassword) => {
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
    throw APIError.unauthorized(
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

  sendChangePasswordMail(user.email, user.full_name);

  return true;
};

export default resetPassService;
