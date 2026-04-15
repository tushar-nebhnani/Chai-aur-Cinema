import pool from "../../../common/db/db.config.js";
import APIError from "../../../common/utils/api.error.js";

const getSeatsService = async (showId) => {
  try {
    // 1. Correct SQL using explicit aliases
    const sql = `
      SELECT s.seat_number, u.full_name
      FROM seats s
      LEFT JOIN booking_seats bs ON s.seat_id = bs.seat_id
      LEFT JOIN bookings b ON bs.booking_id = b.booking_id
      LEFT JOIN users u ON b.user_id = u.user_id
      WHERE s.showtime_id = $1
    `;

    const result = await pool.query(sql, [showId]);

    // 2. The Loop: Ensure you define 'row' (or 's') correctly here
    const bookedMap = {};
    result.rows.forEach((row) => {
      // 💡 If you were using 's.seat_number' here, it would throw "s is not defined"
      // You must use 'row.seat_number' because 'row' is the variable in the loop
      if (row.full_name) {
        bookedMap[row.seat_number] = row.full_name;
      }
    });

    const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const COLS = 10;
    const PREMIUM = ["A", "B"];

    const allSeats = ROWS.flatMap((rowLetter) =>
      Array.from({ length: COLS }, (_, i) => {
        const seatId = `${rowLetter}${i + 1}`;
        return {
          id: seatId,
          row: rowLetter,
          col: i + 1,
          bookedBy: bookedMap[seatId] || null,
          isPremium: PREMIUM.includes(rowLetter),
        };
      }),
    );

    return allSeats;
  } catch (error) {
    // This logs the error so we can see if it's JS or SQL
    console.error("🚨 RAW ERROR 🚨:", error);
    throw APIError.serverError("Failed to fetch seat layout.");
  }
};

export default getSeatsService;
