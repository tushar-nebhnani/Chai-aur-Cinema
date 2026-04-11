// only this file is responsible for talking to the DB nothing else can talk to the DB
import { run, query } from "../../common/db/db.config.js";
import APIError from "../../common/utils/api.error.js";
import APIResponse from "../../common/utils/api.response.js";
import PasswordUtils from "../../common/utils/password.utils.js";

class DBoperations {
  static createUser = async (username, email, password) => {
    if (!username || !email || !password) {
      throw APIError.notFound();
    }

    const hashPass = await PasswordUtils.hash(password);

    const sql = `INSERT INTO users (full_name, email, password_hash) 
        VALUES (?, ?, ?)`;

    const result = await run(sql, [username, email, hashPass]);

    return APIResponse.created(
      `User with ${email} created succesfully`,
      result,
    );
  };

  static getUserByEmail = async (email) => {
    if (!email) {
      throw APIError.notFound("Required email not found.");
    }
    const sql = `SELECT * FROM users WHERE email=${email}`;

    const result = query(sql, [email]);

    return result[0];
  };
}

export default DBoperations;
