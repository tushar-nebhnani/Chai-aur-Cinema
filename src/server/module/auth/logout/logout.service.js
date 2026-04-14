import pool from "../../../common/db/db.config.js";
// import { sendLogoutMail } from "../../../common/notification-service/notification.service.js";

const logoutService = async (userId) => {
  try {
    const result = await pool.query(
      "SELECT email, full_name FROM users WHERE user_id = $1",
      [userId],
    );
    const user = result.rows[0];
    if (user) {
      // sendLogoutMail(user.full_name, user.email);
    }

    return true;
  } catch (error) {
    console.error("Error in logout service:", error);
    throw error;
  }
};

export default logoutService;
