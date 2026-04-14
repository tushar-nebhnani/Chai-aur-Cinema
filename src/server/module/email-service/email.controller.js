import verifyEmailService from "./verify-email.service.js"; // Assume you built this
import APIError from "../../../common/utils/api.error.js";

export const verifyEmailController = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      throw APIError.badRequest("Verification token is missing.");
    }

    const result = await verifyEmailService(token);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
