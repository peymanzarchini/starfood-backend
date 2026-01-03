import { Router } from "express";
import { reviewController } from "../../controllers/review.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { approveReviewSchema } from "../../validators/schemas/review.schema.js";

const router = Router();

/**
 * @route   GET /api/admin/reviews/stats
 * @desc    Get review statistics
 * @access  Admin
 */
router.get("/stats", reviewController.getReviewStats.bind(reviewController));

/**
 * @route   GET /api/admin/reviews
 * @desc    Get all reviews
 * @access  Admin
 */
router.get("/", reviewController.getAllReviewsAdmin.bind(reviewController));

/**
 * @route   GET /api/admin/reviews/:id
 * @desc    Get review by ID
 * @access  Admin
 */
router.get("/:id", reviewController.getReviewByIdAdmin.bind(reviewController));

/**
 * @route   PATCH /api/admin/reviews/:id/approval
 * @desc    Approve or reject review
 * @access  Admin
 */
router.patch(
  "/:id/approval",
  validate(approveReviewSchema),
  reviewController.setReviewApproval.bind(reviewController)
);

/**
 * @route   DELETE /api/admin/reviews/:id
 * @desc    Delete review
 * @access  Admin
 */
router.delete("/:id", reviewController.deleteReviewAdmin.bind(reviewController));

/**
 * @route   POST /api/admin/reviews/bulk-approve
 * @desc    Bulk approve reviews
 * @access  Admin
 */
router.post("/bulk-approve", reviewController.bulkApproveReviews.bind(reviewController));

/**
 * @route   POST /api/admin/reviews/bulk-delete
 * @desc    Bulk delete reviews
 * @access  Admin
 */
router.post("/bulk-delete", reviewController.bulkDeleteReviews.bind(reviewController));

export default router;
