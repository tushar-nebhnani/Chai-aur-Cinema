import APIError from "../../../common/utils/api.error.js";
import { run } from "../../../common/db/db.config.js";

const registerService = async (username, email, password) => {
  if (!username || !email || !password) {
    throw APIError.badRequest(
      "Username, email and password are necessary for login.",
    );
  }

  const hashPass = await PasswordUtils.hash(password);

  try {
    const sql = `INSERT INTO users (full_name, email, password_hash) 
        VALUES (?, ?, ?)`;

    const result = await run(sql, [username, email, hashPass]);

    return true;
  } catch (error) {
    console.error(`Error in registering the user`, error);

    if (error.message.includes("UNIQUE constraint failed")) {
      throw APIError.conflict("A user with this email already exists.");
    }
  }
};

export default registerService;
