import { Product } from "../models/product.model.js";
import { ProductImage } from "../models/productImage.model.js";
import {
  ProductListResponse,
  ProductDetailResponse,
  ProductImageResponse,
} from "../types/index.js";

export function formatProductImageResponse(image: ProductImage): ProductImageResponse {
  return {
    id: image.id,
    url: image.url,
    thumbnailUrl: image.thumbnailUrl,
    altText: image.altText,
    displayOrder: image.displayOrder,
  };
}

export function formatProductListResponse(product: Product): ProductListResponse {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    finalPrice: product.finalPrice,
    discount: product.discount,
    discountAmount: product.discountAmount,
    imageUrl: product.imageUrl,
    isAvailable: product.isAvailable,
    isPopular: product.isPopular,
    preparationTime: product.preparationTime,
    calories: product.calories,
    categoryId: product.categoryId,
  };
}

export function formatProductDetailResponse(product: Product): ProductDetailResponse {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    finalPrice: product.finalPrice,
    discount: product.discount,
    discountAmount: product.discountAmount,
    imageUrl: product.imageUrl,
    isAvailable: product.isAvailable,
    isPopular: product.isPopular,
    preparationTime: product.preparationTime,
    calories: product.calories,
    categoryId: product.categoryId,
    ingredients: product.ingredients || [],
    gallery: product.images
      ? product.images
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map(formatProductImageResponse)
      : [],
    category: product.category
      ? {
          id: product.category.id,
          name: product.category.name,
        }
      : {
          id: product.categoryId,
          name: "",
        },
    createdAt: product.createdAt!,
    updatedAt: product.updatedAt!,
  };
}
