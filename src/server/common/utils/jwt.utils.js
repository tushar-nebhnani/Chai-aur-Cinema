import jwt from "jsonwebtoken";
import crypto from "crypto";

class JWTtokens {
  static generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET_KEY, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "5m",
    });
  };

  static generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "1d",
    });
  };

  static verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY);
  };

  static verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY);
  };

  static generateResetToken = () => {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    return { rawToken, hashedToken };
  };
}

export default JWTtokens;
