import APIError from "../../../common/utils/api.error.js";
import pool from "../../../common/db/db.config.js";
import NotificationService from "../../../common/notification-service/notification.service.js";

const deleteService = async (userId) => {
  try {
    const user = await pool.query(
      `DELETE FROM users WHERE user_id = $1 RETURNING full_name, email`,
      [userId],
    );

    if (user.rowCount === 0) {
      throw APIError.badRequest("User not found or User has already been deleted");
    }

    const deletedUser = user.rows[0];

    NotificationService.sendDeleteAccount(
      deletedUser.email,
      deletedUser.full_name,
    );

    return {
      name: deletedUser.full_name,
      email: deletedUser.email,
    };
  } catch (error) {
    console.error("[DeleteService] Error while deleting the user from the DB:", error);
    throw error;
  }
};

export default deleteService;
