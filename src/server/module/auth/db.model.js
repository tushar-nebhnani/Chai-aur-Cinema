// only this file is responsible for talking to the DB
import { query } from "../../common/db/db.config.js";
import APIError from "../../common/utils/api.error.js";

class DBoperations {
  static getUserByEmail = async (email) => {
    if (!email) {
      throw APIError.notFound("Required email not found.");
    }
    const sql = `SELECT * FROM users WHERE email=${email}`;

    const result = query(sql, [email]);

    return result[0];
  };

  static getUserByUsername = async (username) => {
    if (!email) {
      throw APIError.notFound("Required email not found.");
    }
    const sql = `SELECT * FROM users WHERE username=${username}`;

    const result = query(sql, [email]);

    return result[0];
  };
}

export default DBoperations;
