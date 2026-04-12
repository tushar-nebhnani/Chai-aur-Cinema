import { Router } from "express";
// utilities
import authLimiter from "./common/middleware/api.limiter.js";
import validate from "./common/middleware/validate.middleware.js";

const router = Router();

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
import checkEmptyParams from "./module/auth/login/login.middleware.js";

// register-service
router.post(
  "/register",
  authLimiter,
  validate(RegisterDTO),
  checkExistingEmail,
  checkExistingUsername,
  registerController,
);

// login-service
router.post(
  "/login",
  authLimiter,
  validate(LoginDTO),
  checkEmptyParams,
  loginController,
);

export default router;
