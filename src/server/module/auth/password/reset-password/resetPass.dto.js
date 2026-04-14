import Joi from "joi";
import BaseDTO from "../../../../common/dto/base.dto.js";

class ResetPasswordDTO extends BaseDTO {
  static schema = Joi.object({
    newPassword: Joi.string().trim().max(322).required,
  });
}

export default ResetPasswordDTO;
