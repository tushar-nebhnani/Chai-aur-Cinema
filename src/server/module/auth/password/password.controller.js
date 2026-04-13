// common-utilities
import APIResponse from "../../../common/utils/api.response";
import APIError from "../../../common/utils/api.error";
// change-password service
import changePassService from "./change-password/changePass.service";

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

export { changePasswordController };
