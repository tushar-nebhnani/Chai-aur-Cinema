// common-utilities
import APIResponse from "../../../common/utils/api.response.js";
import APIError from "../../../common/utils/api.error.js";

// change-password service
import changePassService from "./change-password/changePass.service.js";

// reset-password service
import resetPassService from "./reset-password/resetPass.service.js";

const changePasswordController = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    const result = await changePassService(userId, oldPassword, newPassword);

    if (!result) {
      throw APIError.badRequest("Password change failed.");
    }

    return APIResponse.success(res, "Password changed succesfully");
  } catch (error) {
    console.error(
      "[PasswordController] Error while changing the password:",
      error,
    );
    return next(error);
  }
};

const resetPasswordController = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    const token = req.query.token;

    if (!token) {
      throw APIError.notAuthorised("token is missing from the URL expired.");
    }

    const result = await resetPassService(token, newPassword);

    res.clearCookie("resetToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return APIResponse.success(res, "Password changed succesfully", result);
  } catch (error) {
    console.error(
      "[PasswordController] Error while resetting the password:",
      error,
    );
    return next(error);
  }
};

export { changePasswordController, resetPasswordController };
