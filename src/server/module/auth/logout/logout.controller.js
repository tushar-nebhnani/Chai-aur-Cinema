import logoutService from "./logout.service.js";
import APIError from "../../../common/utils/api.error.js";
import APIResponse from "../../../common/utils/api.response.js";

const logoutController = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      throw APIError.badRequest("user_id not found.");
    }

    const result = await logoutService(userId);

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return APIResponse.success(res, "User logout succesfully");
  } catch (error) {
    next(error);
  }
};

export default logoutController;
