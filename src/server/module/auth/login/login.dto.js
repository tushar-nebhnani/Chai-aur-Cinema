import Joi from "joi";
import BaseDTO from "../../../common/dto/base.dto.js";

class LoginDTO extends BaseDTO {
  static schema = Joi.object({
    email: Joi.string().trim().max(322).required(),
    password: Joi.string()
      .trim()
      .min(6)
      .message("Password should be minium 6 characters long.")
      .max(14)
      .required(),
  });
}

export default LoginDTO;
