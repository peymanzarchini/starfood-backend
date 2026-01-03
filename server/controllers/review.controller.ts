import { Request, Response, NextFunction } from "express";
import { reviewService } from "../services/review.service.js";
import { normalizePagination } from "../utils/pagination.js";
import { CreateReviewInput, UpdateReviewInput } from "../validators/schemas/review.schema.js";

/**
 * Review Controller
 * Handles HTTP requests for reviews
 */
class ReviewController {
  // ============================================================
  // PUBLIC ENDPOINTS
  // ============================================================

  /**
   * Get reviews for a product
   * GET /api/products/:productId/reviews
   */
  async getProductReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const productId = parseInt(req.params.productId, 10);
      const pagination = normalizePagination(Number(req.query.page), Number(req.query.limit));

      const result = await reviewService.getProductReviews(productId, pagination);

      res.success("Reviews retrieved successfully", result);
    } catch (error) {
      next(error);
    }
  }

  // ============================================================
  // USER ENDPOINTS
  // ============================================================

  /**
   * Get current user's reviews
   * GET /api/reviews/my
   */
  async getMyReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const pagination = normalizePagination(Number(req.query.page), Number(req.query.limit));

      const result = await reviewService.getUserReviews(userId, pagination);

      res.success("Reviews retrieved successfully", result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create review
   * POST /api/reviews
   */
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

  /**
   * Update review
   * PUT /api/reviews/:id
   */
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

  /**
   * Delete review
   * DELETE /api/reviews/:id
   */
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

  /**
   * Check if user can review a product
   * GET /api/reviews/can-review/:productId
   */
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

  // ============================================================
  // ADMIN ENDPOINTS
  // ============================================================

  /**
   * Get all reviews (admin)
   * GET /api/admin/reviews
   */
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

      const result = await reviewService.getAllReviewsAdmin(pagination, filters);

      res.success("Reviews retrieved successfully", result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get review by ID (admin)
   * GET /api/admin/reviews/:id
   */
  async getReviewByIdAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reviewId = parseInt(req.params.id, 10);

      const review = await reviewService.getReviewByIdAdmin(reviewId);

      res.success("Review retrieved successfully", review);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Approve or reject review (admin)
   * PATCH /api/admin/reviews/:id/approval
   */
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

  /**
   * Delete review (admin)
   * DELETE /api/admin/reviews/:id
   */
  async deleteReviewAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reviewId = parseInt(req.params.id, 10);

      await reviewService.deleteReviewAdmin(reviewId);

      res.success("Review deleted successfully", null);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get review statistics (admin)
   * GET /api/admin/reviews/stats
   */
  async getReviewStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await reviewService.getReviewStats();

      res.success("Review statistics retrieved successfully", stats);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Bulk approve reviews (admin)
   * POST /api/admin/reviews/bulk-approve
   */
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

  /**
   * Bulk delete reviews (admin)
   * POST /api/admin/reviews/bulk-delete
   */
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
