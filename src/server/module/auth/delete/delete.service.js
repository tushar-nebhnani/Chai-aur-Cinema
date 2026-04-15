import APIError from "../../../common/utils/api.error.js";
import pool from "../../../common/db/db.config.js";
import NotificationService from "../../../common/notification-service/notification.service.js";

const deleteService = async (userId) => {
  const client = await pool.connect(); // 💡 Get a dedicated client for the transaction

  try {
    await client.query("BEGIN"); // 🚀 Start Transaction

    // 1. Delete associated seat references first (The "Grandchildren")
    await client.query(
      `DELETE FROM booking_seats WHERE booking_id IN (SELECT booking_id FROM bookings WHERE user_id = $1)`,
      [userId],
    );

    // 2. Delete the user's bookings (The "Children")
    await client.query(`DELETE FROM bookings WHERE user_id = $1`, [userId]);

    // 3. Finally, delete the User (The "Parent")
    const user = await client.query(
      `DELETE FROM users WHERE user_id = $1 RETURNING full_name, email`,
      [userId],
    );

    if (user.rowCount === 0) {
      await client.query("ROLLBACK");
      throw APIError.badRequest("User not found or already deleted");
    }

    const deletedUser = user.rows[0];

    await client.query("COMMIT"); // ✅ Success! Save all changes

    // 💡 Await this for Vercel execution stability
    await NotificationService.sendDeleteAccount(
      deletedUser.email,
      deletedUser.full_name,
    );

    return { name: deletedUser.full_name, email: deletedUser.email };
  } catch (error) {
    await client.query("ROLLBACK"); // 🛑 Undo everything if any step fails
    console.error("[DeleteService] Transaction Error:", error);
    throw error;
  } finally {
    client.release(); // 💡 Always return the client to the pool
  }
};

export default deleteService;
