import { Router } from "express";
import { authController } from "../../controllers/auth.controller.js";

const router = Router();

router.get("/", authController.getAllUsers.bind(authController));
router.get("/:id", authController.getUserById.bind(authController));
router.patch("/:id/role", authController.updateUserRole.bind(authController));
router.patch("/:id/toggle-status", authController.toggleUserStatus.bind(authController));

export default router;
