import { Review, Product, User } from "../models/index.js";
import { HttpError } from "../utils/httpError.js";
import { paginate, getOffset, PaginationOptions } from "../utils/pagination.js";
import {
  formatReviewResponse,
  formatReviewWithProductResponse,
  formatReviewAdminResponse,
} from "../utils/format-response/formatReviewResponse.js";
import {
  ReviewWithProductResponse,
  ReviewAdminResponse,
  ProductReviewsResponse,
} from "../types/index.js";
import { CreateReviewInput, UpdateReviewInput } from "../validators/schemas/review.schema.js";

class ReviewService {
  async getProductReviews(
    productId: number,
    pagination: PaginationOptions,
  ): Promise<ProductReviewsResponse> {
    const { page, limit } = pagination;
    const offset = getOffset(page, limit);

    const product = await Product.findByPk(productId);
    if (!product) {
      throw HttpError.notFound("Product not found");
    }

    const { count, rows } = await Review.findAndCountAll({
      where: { productId, isApproved: true },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const stats = await this.getProductReviewStats(productId);

    const reviews = rows.map(formatReviewResponse);

    return {
      reviews,
      ...paginate(reviews, count, page, limit),
      stats,
    };
  }

  async getProductReviewStats(productId: number) {
    const reviews = await Review.findAll({
      where: { productId, isApproved: true },
      attributes: ["rating"],
    });

    const totalReviews = reviews.length;

    if (totalReviews === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = Math.round((sum / totalReviews) * 10) / 10;

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((review) => {
      const rating = review.rating as 1 | 2 | 3 | 4 | 5;
      ratingDistribution[rating]++;
    });

    return {
      averageRating,
      totalReviews,
      ratingDistribution,
    };
  }

  async getUserReviews(userId: number, pagination: PaginationOptions) {
    const { page, limit } = pagination;
    const offset = getOffset(page, limit);

    const { count, rows } = await Review.findAndCountAll({
      where: { userId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "imageUrl"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const reviews = rows.map(formatReviewWithProductResponse);

    return paginate(reviews, count, page, limit);
  }

  async createReview(userId: number, data: CreateReviewInput): Promise<ReviewWithProductResponse> {
    const product = await Product.findByPk(data.productId);
    if (!product) {
      throw HttpError.notFound("Product not found");
    }

    const existingReview = await Review.findOne({
      where: { userId, productId: data.productId },
    });

    if (existingReview) {
      throw HttpError.conflict("You have already reviewed this product");
    }

    const review = await Review.create({
      userId,
      productId: data.productId,
      rating: data.rating,
      comment: data.comment,
      isApproved: false,
    });

    const createdReview = await Review.findByPk(review.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "imageUrl"],
        },
      ],
    });

    return formatReviewWithProductResponse(createdReview!);
  }

  async updateReview(
    reviewId: number,
    userId: number,
    data: UpdateReviewInput,
  ): Promise<ReviewWithProductResponse> {
    const review = await Review.findOne({
      where: { id: reviewId, userId },
    });

    if (!review) {
      throw HttpError.notFound("Review not found");
    }

    await Review.update(
      {
        rating: data.rating ?? review.rating,
        comment: data.comment ?? review.comment,
        isApproved: false,
      },
      { where: { id: reviewId } },
    );

    const updatedReview = await Review.findByPk(reviewId, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "imageUrl"],
        },
      ],
    });

    return formatReviewWithProductResponse(updatedReview!);
  }

  async deleteReview(reviewId: number, userId: number): Promise<void> {
    const review = await Review.findOne({
      where: { id: reviewId, userId },
    });

    if (!review) {
      throw HttpError.notFound("Review not found");
    }

    await review.destroy();
  }

  async canUserReview(
    userId: number,
    productId: number,
  ): Promise<{ canReview: boolean; reason?: string }> {
    const product = await Product.findByPk(productId);
    if (!product) {
      return { canReview: false, reason: "Product not found" };
    }

    const existingReview = await Review.findOne({
      where: { userId, productId },
    });

    if (existingReview) {
      return { canReview: false, reason: "Already reviewed" };
    }

    return { canReview: true };
  }

  async getAllReviewsAdmin(
    pagination: PaginationOptions,
    filters?: {
      isApproved?: boolean;
      productId?: number;
      rating?: number;
    },
  ) {
    const { page, limit } = pagination;
    const offset = getOffset(page, limit);

    const where: Record<string, unknown> = {};

    if (filters?.isApproved !== undefined) {
      where.isApproved = filters.isApproved;
    }

    if (filters?.productId) {
      where.productId = filters.productId;
    }

    if (filters?.rating) {
      where.rating = filters.rating;
    }

    const { count, rows } = await Review.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "imageUrl"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const reviews = rows.map(formatReviewAdminResponse);

    return paginate(reviews, count, page, limit);
  }

  async getReviewByIdAdmin(reviewId: number): Promise<ReviewAdminResponse> {
    const review = await Review.findByPk(reviewId, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "imageUrl"],
        },
      ],
    });

    if (!review) {
      throw HttpError.notFound("Review not found");
    }

    return formatReviewAdminResponse(review);
  }

  async setReviewApproval(reviewId: number, isApproved: boolean): Promise<ReviewAdminResponse> {
    const review = await Review.findByPk(reviewId);

    if (!review) {
      throw HttpError.notFound("Review not found");
    }

    await Review.update({ isApproved }, { where: { id: reviewId } });

    return this.getReviewByIdAdmin(reviewId);
  }

  async deleteReviewAdmin(reviewId: number): Promise<void> {
    const review = await Review.findByPk(reviewId);

    if (!review) {
      throw HttpError.notFound("Review not found");
    }

    await review.destroy();
  }

  async getReviewStats(): Promise<{
    total: number;
    pending: number;
    approved: number;
    averageRating: number;
  }> {
    const [total, pending, approved] = await Promise.all([
      Review.count(),
      Review.count({ where: { isApproved: false } }),
      Review.count({ where: { isApproved: true } }),
    ]);

    const avgResult = await Review.findOne({
      where: { isApproved: true },
      attributes: [[Review.sequelize!.fn("AVG", Review.sequelize!.col("rating")), "avgRating"]],
      raw: true,
    });

    const averageRating =
      Math.round(((avgResult as unknown as { avgRating: number })?.avgRating || 0) * 10) / 10;

    return {
      total,
      pending,
      approved,
      averageRating,
    };
  }

  async bulkApproveReviews(reviewIds: number[]): Promise<number> {
    const [affectedCount] = await Review.update(
      { isApproved: true },
      { where: { id: reviewIds, isApproved: false } },
    );

    return affectedCount;
  }

  async bulkDeleteReviews(reviewIds: number[]): Promise<number> {
    const deletedCount = await Review.destroy({
      where: { id: reviewIds },
    });

    return deletedCount;
  }
}

export const reviewService = new ReviewService();
