import Joi from "joi";
import BaseDTO from "../../../common/dto/base.dto.js";

class BookingServiceDTO extends BaseDTO {
  static schema = Joi.object({
    showId: Joi.number().integer().positive().required().messages({
      "number.base": "Show ID must be a number.",
      "number.integer": "Show ID cannot be a decimal.",
      "any.required": "Show ID is required.",
    }),

    seatNumber: Joi.string()
      .trim()
      .uppercase()
      .min(2)
      .max(5)
      .required()
      .messages({
        "string.empty": "Seat number cannot be empty.",
        "any.required": "Seat number is required.",
      }),
  });
}

export default BookingServiceDTO;
