import DBoperations from "../db.operations.js";
import APIError from "../../../common/utils/api.error.js";

const checkExistingEmail = async (req, res, next) => {
  const { email } = req.body;
  const user = await DBoperations.getUserByEmail(email);
  if (user) {
    throw APIError.conflict("User with email already exists");
  }
  next();
};

const checkExistingUsername = async (req, res, next) => {
  const { username } = req.body;
  const user = await DBoperations.getUserByUsername(username);
  if (user) {
    throw APIError.conflict(
      "User with username already exists. Please try a different username.",
    );
  }
  next();
};

export { checkExistingEmail, checkExistingUsername };
