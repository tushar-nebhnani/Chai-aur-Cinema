import bcrypt from "bcrypt";

const SALT_ROUNDS = 12; // industry standart

class PasswordUtils {
  static hash = async (password) => {
    return await bcrypt.hash(password, SALT_ROUNDS);
  };

  static compare = async (password, hashPassword) => {
    return await bcrypt.compare(password, hashPassword);
  };
}

export default PasswordUtils;
