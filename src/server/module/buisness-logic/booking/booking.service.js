import pool from "../../../common/db/db.config.js";
import APIError from "../../../common/utils/api.error.js";

const bookingSeatService = async (userId, showId, seatNumber) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const seatQuery = `
      SELECT seat_id 
      FROM seats 
      WHERE show_id = $1 AND seat_number = $2 AND is_booked = FALSE 
      FOR UPDATE
    `;
    const seatResult = await client.query(seatQuery, [showId, seatNumber]);

    if (seatResult.rowCount === 0) {
      throw APIError.badRequest(
        "Seat is no longer available or does not exist.",
      );
    }

    const seatId = seatResult.rows[0].seat_id;

    const updateSeatQuery = `
      UPDATE seats 
      SET is_booked = TRUE, booked_by = $1 
      WHERE seat_id = $2
    `;
    await client.query(updateSeatQuery, [userId, seatId]);

    const insertBookingQuery = `
      INSERT INTO bookings (user_id, seat_id, show_id) 
      VALUES ($1, $2, $3) 
      RETURNING *;
    `;
    const bookingResult = await client.query(insertBookingQuery, [
      userId,
      seatId,
      showId,
    ]);

    await client.query("COMMIT");
    return bookingResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Booking Transaction Failed:", error);

    if (error instanceof APIError) throw error;
    throw APIError.serverError("Server failed to process the booking.");
  } finally {
    client.release();
  }
};

export default bookingSeatService;
