import { Request, Response, NextFunction } from "express";
import { favoriteService } from "../services/favorite.service.js";

class FavoriteController {
  async getFavorites(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const favorites = await favoriteService.getUserFavorites(userId);
      res.success("Favorites retrieved successfully", favorites);
    } catch (error) {
      next(error);
    }
  }

  async toggleFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const productId = parseInt(req.params.productId, 10);
      const result = await favoriteService.toggleFavorite(userId, productId);
      res.success(result.message, result);
    } catch (error) {
      next(error);
    }
  }

  async removeFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const productId = parseInt(req.params.productId, 10);
      const result = await favoriteService.removeFavorite(userId, productId);
      res.success(result.message, null);
    } catch (error) {
      next(error);
    }
  }
}

export const favoriteController = new FavoriteController();
