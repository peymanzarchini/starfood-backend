import { Favorite, Product } from "../models/index.js";
import { HttpError } from "../utils/httpError.js";
import { formatFavoriteResponse } from "../utils/format-response/formatFavoriteResponse.js";

class FavoriteService {
  async getUserFavorites(userId: number) {
    const favorites = await Favorite.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "price", "discount", "imageUrl", "isAvailable"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return favorites.map(formatFavoriteResponse);
  }

  async toggleFavorite(userId: number, productId: number) {
    const existing = await Favorite.findOne({ where: { userId, productId } });

    if (existing) {
      await existing.destroy();
      return { isFavorite: false, message: "Removed from favorites" };
    } else {
      const product = await Product.findByPk(productId);
      if (!product) throw HttpError.notFound("Product not found");

      await Favorite.create({ userId, productId });
      return { isFavorite: true, message: "Added to favorites" };
    }
  }

  async removeFavorite(userId: number, productId: number) {
    const favorite = await Favorite.findOne({ where: { userId, productId } });
    if (!favorite) throw HttpError.notFound("Favorite not found");

    await favorite.destroy();
    return { message: "Favorite removed successfully" };
  }
}

export const favoriteService = new FavoriteService();
