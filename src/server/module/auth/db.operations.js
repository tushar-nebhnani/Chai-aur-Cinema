// only this file is responsible for talking to the DB
import APIError from "../../common/utils/api.error.js";
import pool from "../../common/db/db.config.js";

class DBoperations {
  static getUserByEmail = async (email) => {
    if (!email) {
      throw APIError.notFound("Required email not found.");
    }

    const sql = `SELECT * FROM users WHERE email = $1`;
    const result = await pool.query(sql, [email]);

    return result.rows[0];
  };

  static getUserByUsername = async (username) => {
    if (!username) {
      throw APIError.notFound("Required username not found.");
    }

    const sql = `SELECT * FROM users WHERE full_name = $1`;
    const result = await pool.query(sql, [username]);

    return result.rows[0];
  };
}

export default DBoperations;
