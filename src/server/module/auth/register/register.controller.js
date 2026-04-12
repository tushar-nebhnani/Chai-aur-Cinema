import registerService from "./register.service.js";
import APIResponse from "../../../common/utils/api.response.js";

const registerController = async (req, res) => {
  const { username, email, password } = req.body;

  const user = await registerService(username, email, password);

  APIResponse.created(res, `User with ${email} registered successfully`, user);
};

export default registerController;
