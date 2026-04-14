import Joi from "joi";
import BaseDTO from "../../../../common/dto/base.dto.js";

class ChangePassDTO extends BaseDTO {
  static schema = Joi.object({
    oldPassword: Joi.string().trim().required(),
    newPassword: Joi.string().trim().required(),
  });
}

export default ChangePassDTO;
