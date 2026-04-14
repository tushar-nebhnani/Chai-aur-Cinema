import APIError from "../../../common/utils/api.error.js";
import pool from "../../../common/db/db.config.js";
import { sendDeletetMail } from "../../../common/mail-service/email.service.js";

const deleteService = async (userId) => {
  try {
    const user = await pool.query(
      `DELETE FROM users WHERE user_id = $1 RETURNING full_name, email`,
      [userId],
    );

    if (user.rowCount === 0) {
      APIError.badRequest("User not found or User has already been deleted");
    }

    const deletedUser = user.rows[0];

    sendDeletetMail(deletedUser.email);

    return {
      name: user.full_name,
      email: user.email,
    };
  } catch (error) {
    console.error("Error while deleting the user from the DB.");
  }
};

export default deleteService;
