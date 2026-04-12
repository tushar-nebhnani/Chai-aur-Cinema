import APIError from "../../../common/utils/api.error.js";
import JWTtokens from "../../../common/utils/jwt.utils.js";
import PasswordUtils from "../../../common/utils/password.utils.js";

const registerService = async (username, email, password) => {
  if (!username || !email || !password) {
    throw APIError.badRequest(
      "Username, email and password are necessary for login.",
    );
  }

  const hashPass = await PasswordUtils.hash(password);
  const { rawToken, hashedToken } = JWTtokens.generateResetToken();
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + 24);
  const formattedExpiry = expiryDate.toISOString();

  try {
    const sql = `INSERT INTO users ( full_name ,
                email   ,
                password_hash ,
                is_verified ,
                reset_token,
                token_expiry)
        VALUES (?, ?, ?, 0, ?, ?)`;

    const result = await run(sql, [
      username,
      email,
      hashPass,
      hashedToken,
      formattedExpiry,
    ]);

    return {
      userId: result.id,
      email: email,
      verificationToken: rawToken,
    };
  } catch (error) {
    console.error(`Error in registering the user`, error);

    if (error.message.includes("UNIQUE constraint failed")) {
      throw APIError.conflict("A user with this email already exists.");
    }
  }
};

export default registerService;
