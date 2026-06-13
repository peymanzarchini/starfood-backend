import { Request, Response, NextFunction } from "express";
import { reviewService } from "../services/review.service.js";
import { getPaginationMeta, normalizePagination } from "../utils/pagination.js";
import { CreateReviewInput, UpdateReviewInput } from "../validators/schemas/review.schema.js";

class ReviewController {
  async getProductReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const productId = parseInt(req.params.productId, 10);
      const pagination = normalizePagination(Number(req.query.page), Number(req.query.limit));

      const { items, totalItems, stats } = await reviewService.getProductReviews(
        productId,
        pagination,
      );
      const paginationMeta = getPaginationMeta(totalItems, pagination.page, pagination.limit);

      res.success("Reviews retrieved successfully", { reviews: items, stats }, 200, paginationMeta);
    } catch (error) {
      next(error);
    }
  }

  async getMyReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const pagination = normalizePagination(Number(req.query.page), Number(req.query.limit));

      const { items, totalItems } = await reviewService.getUserReviews(userId, pagination);
      const paginationMeta = getPaginationMeta(totalItems, pagination.page, pagination.limit);

      res.success("Reviews retrieved successfully", items, 200, paginationMeta);
    } catch (error) {
      next(error);
    }
  }

  async createReview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const data: CreateReviewInput = req.body;

      const review = await reviewService.createReview(userId, data);

      res.success("Review submitted successfully. Awaiting approval.", review, 201);
    } catch (error) {
      next(error);
    }
  }

  async updateReview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const reviewId = parseInt(req.params.id, 10);
      const data: UpdateReviewInput = req.body;

      const review = await reviewService.updateReview(reviewId, userId, data);

      res.success("Review updated successfully. Awaiting re-approval.", review);
    } catch (error) {
      next(error);
    }
  }

  async deleteReview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const reviewId = parseInt(req.params.id, 10);

      await reviewService.deleteReview(reviewId, userId);

      res.success("Review deleted successfully", null);
    } catch (error) {
      next(error);
    }
  }

  async canReview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const productId = parseInt(req.params.productId, 10);

      const result = await reviewService.canUserReview(userId, productId);

      res.success("Review eligibility checked", result);
    } catch (error) {
      next(error);
    }
  }

  async getAllReviewsAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = normalizePagination(Number(req.query.page), Number(req.query.limit));
      const filters = {
        isApproved:
          req.query.isApproved === "true"
            ? true
            : req.query.isApproved === "false"
              ? false
              : undefined,
        productId: req.query.productId ? Number(req.query.productId) : undefined,
        rating: req.query.rating ? Number(req.query.rating) : undefined,
      };

      const { items, totalItems } = await reviewService.getAllReviewsAdmin(pagination, filters);
      const paginationMeta = getPaginationMeta(totalItems, pagination.page, pagination.limit);

      res.success("Reviews retrieved successfully", items, 200, paginationMeta);
    } catch (error) {
      next(error);
    }
  }

  async getReviewByIdAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reviewId = parseInt(req.params.id, 10);

      const review = await reviewService.getReviewByIdAdmin(reviewId);

      res.success("Review retrieved successfully", review);
    } catch (error) {
      next(error);
    }
  }

  async setReviewApproval(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reviewId = parseInt(req.params.id, 10);
      const { isApproved } = req.body;

      if (typeof isApproved !== "boolean") {
        res.fail("isApproved must be a boolean", null, 400);
        return;
      }

      const review = await reviewService.setReviewApproval(reviewId, isApproved);

      const message = isApproved ? "Review approved successfully" : "Review rejected successfully";

      res.success(message, review);
    } catch (error) {
      next(error);
    }
  }

  async deleteReviewAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reviewId = parseInt(req.params.id, 10);

      await reviewService.deleteReviewAdmin(reviewId);

      res.success("Review deleted successfully", null);
    } catch (error) {
      next(error);
    }
  }

  async getReviewStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await reviewService.getReviewStats();

      res.success("Review statistics retrieved successfully", stats);
    } catch (error) {
      next(error);
    }
  }

  async bulkApproveReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { reviewIds } = req.body;

      if (!Array.isArray(reviewIds) || reviewIds.length === 0) {
        res.fail("reviewIds must be a non-empty array", null, 400);
        return;
      }

      const affectedCount = await reviewService.bulkApproveReviews(reviewIds);

      res.success(`${affectedCount} review(s) approved successfully`, {
        affectedCount,
      });
    } catch (error) {
      next(error);
    }
  }

  async bulkDeleteReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { reviewIds } = req.body;

      if (!Array.isArray(reviewIds) || reviewIds.length === 0) {
        res.fail("reviewIds must be a non-empty array", null, 400);
        return;
      }

      const deletedCount = await reviewService.bulkDeleteReviews(reviewIds);

      res.success(`${deletedCount} review(s) deleted successfully`, {
        deletedCount,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const reviewController = new ReviewController();
