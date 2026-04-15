import loginService from "./login.service.js";
import APIResponse from "../../../common/utils/api.response.js";

const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { token, user } = await loginService(email, password);

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return APIResponse.success(res, "User logged in successfully", user);
  } catch (error) {
    console.error("[LoginController] Failed to log in user:", error);
    return next(error);
  }
};

export default loginController;
