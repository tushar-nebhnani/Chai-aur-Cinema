import pool from "../../../common/db/db.config.js";
import APIError from "../../../common/utils/api.error.js";
import NotificationService from "../../../common/notification-service/notification.service.js";

const bookingSeatService = async (showId, seatId, userId, price) => {
  const client = await pool.connect();

  try {
    const sql = `SELECT * FROM users WHERE user_id=$1`;
    const result = await pool.query(sql, [userId]);
    const user = result.rows[0];
    await client.query("BEGIN");

    // 1. Fetch the actual INTEGER seat_id using the seat_number (e.g., 'E8')
    const seatLockSql = `
      SELECT seat_id FROM seats 
      WHERE showtime_id = $1 AND UPPER(seat_number) = UPPER($2) AND is_booked = FALSE
      FOR UPDATE
    `;
    const seatResult = await client.query(seatLockSql, [showId, seatId]);

    if (seatResult.rowCount === 0) {
      throw APIError.badRequest(
        "Seat is no longer available or does not exist.",
      );
    }

    const internalSeatId = seatResult.rows[0].seat_id;

    const bookingSql = `
      INSERT INTO bookings (user_id, showtime_id, total_amount, payment_status)
      VALUES ($1, $2, $3, 'SUCCESS')
      RETURNING booking_id
    `;
    const bookingResult = await client.query(bookingSql, [
      userId,
      showId,
      price,
    ]);
    const newBookingId = bookingResult.rows[0].booking_id;

    await client.query("UPDATE seats SET is_booked = TRUE WHERE seat_id = $1", [
      internalSeatId,
    ]);

    await client.query(
      "INSERT INTO booking_seats (booking_id, seat_id) VALUES ($1, $2)",
      [newBookingId, internalSeatId],
    );

    await client.query("COMMIT");

    NotificationService.sendTicketsBooked(user.email, seatId, price);
    return { bookingId: newBookingId, seatNumber: seatId };
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("🚨 BOOKING ERROR:", error.message);
    if (error.status === 400) throw error;
    throw APIError.serverError("Booking failed.");
  } finally {
    client.release();
  }
};

export default bookingSeatService;
