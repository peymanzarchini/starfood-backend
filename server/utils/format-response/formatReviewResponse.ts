import { Review } from "../../models/review.model.js";
import {
  ReviewResponse,
  ReviewWithProductResponse,
  ReviewAdminResponse,
} from "../../types/index.js";

/**
 * Format review for public response
 */
export function formatReviewResponse(review: Review): ReviewResponse {
  const user = review.user!;

  return {
    id: review.id,
    rating: review.rating,
    comment: review.comment,
    isApproved: review.isApproved,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    createdAt: review.createdAt!,
    updatedAt: review.updatedAt!,
  };
}

/**
 * Format review with product info
 */
export function formatReviewWithProductResponse(review: Review): ReviewWithProductResponse {
  const product = review.product!;

  return {
    ...formatReviewResponse(review),
    product: {
      id: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
    },
  };
}

/**
 * Format review for admin response (includes email)
 */
export function formatReviewAdminResponse(review: Review): ReviewAdminResponse {
  const user = review.user!;
  const product = review.product!;

  return {
    id: review.id,
    rating: review.rating,
    comment: review.comment,
    isApproved: review.isApproved,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
    product: {
      id: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
    },
    createdAt: review.createdAt!,
    updatedAt: review.updatedAt!,
  };
}
