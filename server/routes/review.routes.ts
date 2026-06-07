import { Router } from "express";
import { reviewController } from "../controllers/review.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createReviewSchema, updateReviewSchema } from "../validators/schemas/review.schema.js";

const router = Router();

router.get("/my", authenticate, reviewController.getMyReviews.bind(reviewController));

router.get(
  "/can-review/:productId",
  authenticate,
  reviewController.canReview.bind(reviewController),
);

router.post(
  "/",
  authenticate,
  validate(createReviewSchema),
  reviewController.createReview.bind(reviewController),
);

router.put(
  "/:id",
  authenticate,
  validate(updateReviewSchema),
  reviewController.updateReview.bind(reviewController),
);

router.delete("/:id", authenticate, reviewController.deleteReview.bind(reviewController));

export default router;
