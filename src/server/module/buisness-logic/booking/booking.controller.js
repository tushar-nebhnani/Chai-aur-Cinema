import bookingService from "./booking.service.js";
import APIResponse from "../../common/utils/api.response.js";

const bookingServiceController = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { showId, seatNumber } = req.body;

    const booking = await bookingService.bookSeat(userId, showId, seatNumber);

    return APIResponse.success(res, "Ticket booked successfully!", booking);
  } catch (error) {
    next(error);
  }
};

export default bookingServiceController;
