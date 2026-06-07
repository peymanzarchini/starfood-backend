import { Router } from "express";
import { reviewController } from "../../controllers/review.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { approveReviewSchema } from "../../validators/schemas/review.schema.js";

const router = Router();

router.get("/stats", reviewController.getReviewStats.bind(reviewController));

router.get("/", reviewController.getAllReviewsAdmin.bind(reviewController));

router.get("/:id", reviewController.getReviewByIdAdmin.bind(reviewController));

router.patch(
  "/:id/approval",
  validate(approveReviewSchema),
  reviewController.setReviewApproval.bind(reviewController),
);

router.delete("/:id", reviewController.deleteReviewAdmin.bind(reviewController));

router.post("/bulk-approve", reviewController.bulkApproveReviews.bind(reviewController));

router.post("/bulk-delete", reviewController.bulkDeleteReviews.bind(reviewController));

export default router;
