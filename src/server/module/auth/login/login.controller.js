import loginService from "./login.service.js";
import APIResponse from "../../../common/utils/api.response.js";

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await loginService(email, password);

    res.cookie("accessToken", result.token, {
      httpOnly: true, // Javascript cannot read this (prevents XSS)
      secure: process.env.NODE_ENV === "production", // True in prod, false in dev
      sameSite: "strict", // Prevents Cross-Site Request Forgery
      maxAge: 24 * 60 * 60 * 1000, // Expires in 24 hours
    });

    return APIResponse.success(res, "User logged in successfully", user);
  } catch (error) {
    console.error("Error while logging the user.");
  }
};

export default loginController;
