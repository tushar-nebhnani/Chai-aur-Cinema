import logoutService from "./logout.service.js";
import APIError from "../../../common/utils/api.error.js";
import APIResponse from "../../../common/utils/api.response.js";

const logoutController = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw APIError.badRequest("user_id not found. From logout controller");
    }

    console.info(`[LogoutController] Logging out user id=${userId}`);

    const result = await logoutService(userId);

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return APIResponse.success(res, "User logout succesfully", result);
  } catch (error) {
    console.error("[LogoutController] Error during logout:", error);
    return next(error);
  }
};

export default logoutController;
