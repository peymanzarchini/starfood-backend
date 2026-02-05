import { Router } from "express";
import { favoriteController } from "../controllers/favorite.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/", favoriteController.getFavorites.bind(favoriteController));
router.post("/toggle/:productId", favoriteController.toggleFavorite.bind(favoriteController));
router.delete("/:productId", favoriteController.removeFavorite.bind(favoriteController));

export default router;
