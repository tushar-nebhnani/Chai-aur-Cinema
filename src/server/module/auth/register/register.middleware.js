import APIError from "../../../common/utils/api.error.js";
import pool from "../../../common/db/db.config.js";

const checkExistingEmail = async (req, res, next) => {
  const { email } = req.body;
  const sql = `SELECT * FROM users WHERE email=$1`;
  const result = await pool.query(sql, [email]);
  const user = result.rows[0];
  if (user) {
    throw APIError.conflict("User with email already exists");
  }
  next();
};

const checkExistingUsername = async (req, res, next) => {
  const { username } = req.body;
  const sql = `SELECT * FROM users WHERE full_name=$1`;
  const result = await pool.query(sql, [username]);
  const user = result.rows[0];
  if (user) {
    throw APIError.conflict(
      "User with username already exists. Please try a different username.",
    );
  }
  next();
};

export { checkExistingEmail, checkExistingUsername };
