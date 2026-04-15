import { Router } from "express";

// utilities
import authLimiter from "./common/middleware/api.limiter.js";
import validate from "./common/middleware/validate.middleware.js";
import verifyToken from "./module/auth/auth.middleware.js";

const router = Router();

// AUTHENTICATION SERVICE

// register-service
import registerController from "./module/auth/register/register.controller.js";
import RegisterDTO from "./module/auth/register/register.dto.js";
import {
  checkExistingEmail,
  checkExistingUsername,
} from "./module/auth/register/register.middleware.js";

// login-service
import LoginDTO from "./module/auth/login/login.dto.js";
import loginController from "./module/auth/login/login.controller.js";
import checkEmptyParamsLogin from "./module/auth/login/login.middleware.js";

// log-out service
import logoutController from "./module/auth/logout/logout.controller.js";

// Password-services
import {
  changePasswordController,
  resetPasswordController,
} from "./module/auth/password/password.controller.js";
// change-password service
import ChangePassDTO from "./module/auth/password/change-password/changePass.dto.js";
import checkEmptyParamsChangePass from "./module/auth/password/change-password/changePass.middleware.js";
// reset-password service
import ResetPasswordDTO from "./module/auth/password/reset-password/resetPass.dto.js";

// delete - service
import deleteServiceController from "./module/auth/delete/delete.controller.js";

// BUSINESS LOGIC

// booking-service
import bookingServiceController from "./module/buisness-logic/booking/booking.controller.js";
import BookingServiceDTO from "./module/buisness-logic/booking/booking.dto.js";

// get-seats service
import getSeatsController from "./module/buisness-logic/get-seats/get-seats.controller.js";

// register-service
router.post(
  "/register",
  // authLimiter,
  validate(RegisterDTO),
  // checkExistingEmail,
  // checkExistingUsername,
  registerController,
);

// login-service
router.post(
  "/login",
  // authLimiter,
  validate(LoginDTO),
  checkEmptyParamsLogin,
  loginController,
);

// log-out service
router.post(
  "/logout",
  // authLimiter,
  verifyToken,
  logoutController,
);

// forgot-password
router.put(
  "/change-password",
  // authLimiter,
  verifyToken,
  validate(ChangePassDTO),
  checkEmptyParamsChangePass,
  changePasswordController,
);

// reset-password
router.put(
  "/reset-password",
  // authLimiter,
  validate(ResetPasswordDTO),
  resetPasswordController,
);

// delete-service
router.delete(
  "/delete-account",
  // authLimiter,
  verifyToken,
  deleteServiceController,
);

// booking-seats service
router.post(
  "/book-seats",
  // authLimiter,
  verifyToken,
  validate(BookingServiceDTO),
  bookingServiceController,
);

// get-seats service
router.get("/get-seats", authLimiter, getSeatsController);

export default router;
