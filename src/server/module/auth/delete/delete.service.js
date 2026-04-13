import APIError from "../../../common/utils/api.error.js";
import pool from "../../../common/db/db.config.js";

const deleteService = async (userId) => {
  try {
    await pool.query(`DELETE FROM users WHERE user_id = $1`, [userId]);
    return true;
  } catch (error) {
    console.error("Error while deleting the user from the DB.");
  }
};

export default deleteService;
