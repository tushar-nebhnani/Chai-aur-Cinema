import registerService from "./register.service.js";
import APIResponse from "../../../common/utils/api.response.js";

const registerController = async (req, res) => {
  const { username, email, password } = req.body;

  const user = await registerService(username, email, password);
  res.cookie("accessToken", user.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevent CSRF attack
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", user.refreshToken, {
    httpOnly: true, // Prevents JS access
    secure: process.env.NODE_ENV === "production", // Only over HTTPS
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  APIResponse.created(`User with ${email} registered successfully`, user);
};

export default registerController;
