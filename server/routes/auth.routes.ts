import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  updateProfileSchema,
} from "../validators/schemas/auth.schema.js";
import {
  authLimiter,
  passwordLimiter,
  refreshLimiter,
  registerLimiter,
} from "../middlewares/rateLimiters.js";

const router = Router();

router.post(
  "/register",
  registerLimiter,
  validate(registerSchema),
  authController.register.bind(authController),
);

router.post(
  "/login",
  authLimiter,
  validate(loginSchema),
  authController.login.bind(authController),
);

router.post("/refresh", refreshLimiter, authController.refreshToken.bind(authController));

router.post("/logout", authenticate, authController.logout.bind(authController));

router.get("/profile", authenticate, authController.getProfile.bind(authController));

router.patch(
  "/profile",
  authenticate,
  validate(updateProfileSchema),
  authController.updateProfile.bind(authController),
);

router.post(
  "/change-password",
  authenticate,
  passwordLimiter,
  validate(changePasswordSchema),
  authController.changePassword.bind(authController),
);

export default router;
