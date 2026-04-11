import DBoperations from "../db.model.js";
import APIError from "../../../common/utils/api.error.js";

const checkExistingEmail = async (email) => {
  const user = await DBoperations.getUserByEmail(email);
  if (user) {
    throw APIError.conflict("User with email already exists");
  }
};

const checkExistingUsername = async (username) => {
  const user = await DBoperations.getUserByUsername(username);
  if (user) {
    throw APIError.conflict(
      "User with username already exists. Please try different username.",
    );
  }
};

export { checkExistingEmail, checkExistingUsername };
