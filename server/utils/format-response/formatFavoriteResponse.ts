import { Favorite } from "../../models/favorite.model.js";
import { FavoriteResponse } from "../../types/index.js";

/**
 * Format favorite for response
 */
export function formatFavoriteResponse(favorite: Favorite): FavoriteResponse {
  const product = favorite.product!;
  const finalPrice =
    product.discount > 0 ? Math.round(product.price * (1 - product.discount / 100)) : product.price;

  return {
    id: favorite.id,
    productId: favorite.productId,
    product: {
      id: product.id,
      name: product.name,
      price: product.price,
      finalPrice,
      discount: product.discount,
      imageUrl: product.imageUrl,
      isAvailable: product.isAvailable,
    },
    createdAt: favorite.createdAt!,
  };
}
