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

router.post(
  "/register",
  authLimiter,
  validate(RegisterDTO),
  checkExistingEmail,
  checkExistingUsername,
  registerController,
);

export default router;
