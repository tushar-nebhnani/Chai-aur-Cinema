import pool from "../../../../common/db/db.config.js";
import PasswordUtils from "../../../../common/utils/password.utils.js";
import APIErrors from "../../../../common/utils/api.error.js";
import NotificationService from "../../../../common/notification-service/notification.service.js";

const changePassService = async (userId, oldPassword, newPassword) => {
  try {
    const userData = await pool.query(`SELECT * FROM users WHERE user_id=$1`, [
      userId,
    ]);
    const user = userData.rows[0];
    if (!user) {
      throw APIErrors.badRequest("Invalid user_id. User not found.");
    }

    const isPasswordValid = await PasswordUtils.compare(
      oldPassword,
      user.password_hash,
    );
    if (!isPasswordValid) {
      throw APIErrors.badRequest("Password doesn't match. Please try again.");
    }

    const hashPassword = await PasswordUtils.hash(newPassword);

    await pool.query(`UPDATE users SET password_hash = $1 WHERE user_id = $2`, [
      hashPassword,
      userId,
    ]);

    NotificationService.sendChangedPassword(user.email, user.full_name);

    return true;
  } catch (error) {
    console.error("[ChangePassService] Error while changing password:", error);
    throw error;
  }
};

export default changePassService;
