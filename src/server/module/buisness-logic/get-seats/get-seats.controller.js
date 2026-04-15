import getSeatsService from "./get-seats.service.js";
import APIResponse from "../../../common/utils/api.response.js";
import APIError from "../../../common/utils/api.error.js";

const getSeatsController = async (req, res, next) => {
  try {
    const showId = req.query.showId;

    if (!showId) {
      throw APIError.badRequest("showId query parameter is required.");
    }

    const seats = await getSeatsService(showId);

    return APIResponse.success(
      res,
      "Live seat map fetched successfully",
      seats,
    );
  } catch (error) {
    console.error("[GetSeatsController] Error:", error);
    return next(error);
  }
};

export default getSeatsController;
