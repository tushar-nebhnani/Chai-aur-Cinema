import Joi from "joi";
import BaseDTO from "../../../common/dto/base.dto.js";

class LoginDTO extends BaseDTO {
  static schema = Joi.object({
    email: Joi.string().trim().required(),
    password: Joi.string().trim().required(),
  });
}

export default LoginDTO;
