import loginService from "./login.service.js";
import APIResponse from "../../../common/utils/api.response.js";

const loginController = async (req, res) => {
  const { email, password } = req.body;

  const user = await loginService(email, password);

  return APIResponse.created(res, "User logged in successfully", user);
};

export default loginController;
