import express from "express";
import {
	addReview,
	getReviews,
} from "../../controllers/Review/review.controller";

const router = express.Router();

/**
 * @swagger
 * /api/v{version}/reviews/{productId}:
 *   post:
 *     summary: Add a Review
 *     tags: [Reviews]
 *     description: Allows a user to add a review to a product they have purchased.
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           example: "product_id"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 example: 5
 *               review:
 *                 type: string
 *                 example: "Great product!"
 *     responses:
 *       201:
 *         description: Review added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Review added successfully"
 *                 payload:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                       example: "product_id"
 *                     user:
 *                       type: string
 *                       example: "user_id"
 *                     rating:
 *                       type: integer
 *                       example: 5
 *                     review:
 *                       type: string
 *                       example: "Great product!"
 *       400:
 *         description: Invalid input
 *       403:
 *         description: User did not purchase the product
 *       404:
 *         description: Product not found
 */
router.post("/:productId", addReview);

/**
 * @swagger
 * /api/v{version}/reviews/{productId}:
 *   get:
 *     summary: Get Reviews for a Product
 *     tags: [Reviews]
 *     description: Retrieves all reviews for a specific product with filtering, sorting, and pagination.
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           example: "product_id"
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           example: "-createdAt"
 *         description: Sort reviews by a specific field
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of reviews to return per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 payload:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product:
 *                         type: string
 *                         example: "product_id"
 *                       user:
 *                         type: string
 *                         example: "user_id"
 *                       rating:
 *                         type: integer
 *                         example: 5
 *                       review:
 *                         type: string
 *                         example: "Great product!"
 *       400:
 *         description: Invalid productId
 *       404:
 *         description: No reviews found
 */
router.get("/:productId", getReviews);

export { router };
