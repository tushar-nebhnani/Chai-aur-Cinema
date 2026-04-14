import deleteService from "./delete.service.js";
import APIError from "../../../common/utils/api.error.js";
import APIResponse from "../../../common/utils/api.response.js";

const deleteServiceController = async (req, res) => {
  const userId = req.user.user_id;
  if (!userId) {
    APIError.badRequest("User ID not found.");
  }
  const result = await deleteService(userId);

  if (result) {
    res.clearCookie("accessToken");
    APIResponse.success(res, "Account deleted succesfully", result);
  }
};

export default deleteServiceController;
