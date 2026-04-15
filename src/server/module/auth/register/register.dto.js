import Joi from "joi";
import BaseDTO from "../../../common/dto/base.dto.js";

class RegisterDTO extends BaseDTO {
  static schema = Joi.object({
    full_name: Joi.string().trim().min(4).max(27).required(),
    email: Joi.string().email().trim().max(322).required(),
    password: Joi.string()
      .trim()
      .min(6)
      .message("Password should be minium 6 characters long.")
      .max(14)
      .required(),
  });
}

export default RegisterDTO;
