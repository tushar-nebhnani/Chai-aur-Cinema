import JWTtokens from "../../../common/utils/jwt.utils.js";
import pool from "../../../common/db/db.config.js";
import PasswordUtils from "../../../common/utils/password.utils.js";

const registerService = async (username, email, password) => {
  const hashPass = await PasswordUtils.hash(password);
  const { rawToken, hashedToken } = JWTtokens.generateResetToken();
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + 24);
  const formattedExpiry = expiryDate.toISOString();

  try {
    const sql = `
      INSERT INTO users (full_name, email, password_hash, is_verified, reset_token, token_expiry)
      VALUES ($1, $2, $3, false, $4, $5)
      RETURNING user_id;
    `;

    const values = [username, email, hashPass, hashedToken, formattedExpiry];

    const result = await pool.query(sql, values);

    return {
      userId: result.rows[0].user_id,
      email: email,
      verificationToken: rawToken,
    };
  } catch (error) {
    console.error(`Error in registering the user`, error);

    throw error;
  }
};

export default registerService;
