// common-utilities
import APIResponse from "../../../common/utils/api.response.js";
import APIError from "../../../common/utils/api.error.js";

// change-password service
import changePassService from "./change-password/changePass.service.js";

// reset-password service
import resetPassService from "./reset-password/resetPass.service.js";

const changePasswordController = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.user_id;

    const user = await changePassService(userId, oldPassword, newPassword);

    if (!user) {
      throw APIError.badRequest();
    }

    APIResponse.success(res, "Password changed succesfully");
  } catch (error) {
    console.error("Error while changing the password.");
  }
};

const resetPasswordController = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const token = req.cookies.resetToken;

    if (!token) {
      throw APIError.unauthorized("Reset token is missing or expired.");
    }

    const result = await resetPassService(token, newPassword);

    res.clearCookie("resetToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    APIResponse.success(res, "Password changed succesfully", result);
  } catch (error) {
    console.error("error while resetting the password.");
  }
};

export { changePasswordController, resetPasswordController };
