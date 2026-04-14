import registerService from "./register.service.js";
import APIResponse from "../../../common/utils/api.response.js";

const registerController = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const user = await registerService(username, email, password);

    return APIResponse.created(
      res,
      `User with ${email} registered successfully`,
      user,
    );
  } catch (error) {
    console.error("[RegisterController] Failed to register user:", error);
    return next(error);
  }
};

export default registerController;
