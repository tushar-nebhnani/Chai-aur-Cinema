import pool from "../../../common/db/db.config.js";
import NotificationService from "../../../common/notification-service/notification.service.js";

const logoutService = async (userId) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      userId,
    ]);
    const user = result.rows[0];
    NotificationService.sendLogoutAlert(user.email, user.full_name);

    return user;
  } catch (error) {
    console.error("Error in logout service:", error);
    throw error;
  }
};

export default logoutService;
