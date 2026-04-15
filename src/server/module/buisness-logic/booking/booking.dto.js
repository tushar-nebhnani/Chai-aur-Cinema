import Joi from "joi";
import BaseDTO from "../../../common/dto/base.dto.js";

class BookingServiceDTO extends BaseDTO {
  static schema = Joi.object({
    showId: Joi.number().required(),
    seatNumber: Joi.string().required(),
    price: Joi.number().required(),
  });
}

export default BookingServiceDTO;
