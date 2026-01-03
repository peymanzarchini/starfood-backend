import { Router } from "express";
import { reviewController } from "../controllers/review.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createReviewSchema, updateReviewSchema } from "../validators/schemas/review.schema.js";

const router = Router();

/**
 * @route   GET /api/reviews/my
 * @desc    Get current user's reviews
 * @access  Private
 */
router.get("/my", authenticate, reviewController.getMyReviews.bind(reviewController));

/**
 * @route   GET /api/reviews/can-review/:productId
 * @desc    Check if user can review a product
 * @access  Private
 */
router.get(
  "/can-review/:productId",
  authenticate,
  reviewController.canReview.bind(reviewController)
);

/**
 * @route   POST /api/reviews
 * @desc    Create new review
 * @access  Private
 */
router.post(
  "/",
  authenticate,
  validate(createReviewSchema),
  reviewController.createReview.bind(reviewController)
);

/**
 * @route   PUT /api/reviews/:id
 * @desc    Update review
 * @access  Private
 */
router.put(
  "/:id",
  authenticate,
  validate(updateReviewSchema),
  reviewController.updateReview.bind(reviewController)
);

/**
 * @route   DELETE /api/reviews/:id
 * @desc    Delete review
 * @access  Private
 */
router.delete("/:id", authenticate, reviewController.deleteReview.bind(reviewController));

export default router;
