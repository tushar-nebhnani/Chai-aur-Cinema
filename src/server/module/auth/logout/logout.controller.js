import logoutService from "./logout.service.js";
import APIError from "../../../common/utils/api.error.js";
import APIResponse from "../../../common/utils/api.response.js";

const logoutController = async (req, res, next) => {
  try {
    console.log("🚨 WHAT IS REQ.USER?:", req.user);
    const userId = req.user.id;

    if (!userId) {
      throw APIError.badRequest("user_id not found. From logout controller");
    }

    const result = await logoutService(userId);

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return APIResponse.success(res, "User logout succesfully", result);
  } catch (error) {
    next(error);
  }
};

export default logoutController;
