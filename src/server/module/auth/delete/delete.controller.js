import deleteService from "./delete.service.js";
import APIError from "../../../common/utils/api.error.js";
import APIResponse from "../../../common/utils/api.response.js";

const deleteServiceController = async (req, res, next) => {
  try {
    const userId = req.user?.user_id;

    if (!userId) {
      throw APIError.badRequest("User ID not found.");
    }

    const result = await deleteService(userId);

    if (result) {
      res.clearCookie("accessToken");
      return APIResponse.success(res, "Account deleted succesfully", result);
    }

    throw APIError.serverError("Unable to delete account.");
  } catch (error) {
    console.error("[DeleteController] Error deleting account:", error);
    return next(error);
  }
};

export default deleteServiceController;
