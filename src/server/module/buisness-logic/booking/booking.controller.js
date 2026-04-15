import bookingSeatService from "./booking.service.js";
import APIResponse from "../../../common/utils/api.response.js";

const bookingServiceController = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { showId, seatNumber, price } = req.body;

    const booking = await bookingSeatService(
      showId, // 1
      seatNumber, // "F8"
      userId, // 1
      price, // 380
    );

    return APIResponse.success(res, "Ticket booked successfully!", booking);
  } catch (error) {
    next(error);
  }
};

export default bookingServiceController;
