import verifyEmailService from "./verify-email.service.js"; // Assume you built this
import APIError from "../../../common/utils/api.error.js";
import APIResponse from "../../../common/utils/api.response.js";

export const verifyEmailController = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      throw APIError.badRequest("Verification token is missing.");
    }

    const result = await verifyEmailService(token);

    return APIResponse.success(res, result.message, result);
  } catch (error) {
    console.error("[EmailController] Email verification failed:", error);
    return next(error);
  }
};
