import express from "express";
import {
	addReview,
	getReviews,
} from "../../controllers/Review/review.controller";

const router = express.Router();

router.post("/:productId", addReview);
router.get("/:productId", getReviews);

export { router };
