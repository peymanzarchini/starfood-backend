import { Router } from "express";
import { settingsController } from "../../controllers/settings.controller.js";

const router = Router();

router.get("/", settingsController.getAllSettings.bind(settingsController));
router.patch("/:key", settingsController.updateSetting.bind(settingsController));

export default router;
