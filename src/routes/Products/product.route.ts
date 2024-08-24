import express, { Router } from "express";

// Importing the controller functions
import {
	getAllProducts,
	getProduct,
} from "../../controllers/Products/getProducts.controller";

const router: Router = express.Router();

/**
 * @swagger
 * /api/v{version}/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     security: []
 *     description: Fetches all available products with optional filtering and limiting of fields.
 *     parameters:
 *       - in: path
 *         name: version
 *         schema:
 *           type: string
 *         required: true
 *         description: The API version
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Fields to limit in the response
 *     responses:
 *       200:
 *         description: Successfully fetched products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 results:
 *                   type: number
 *                   example: 10
 *                 message:
 *                   type: string
 *                   example: Products fetched successfully
 *                 payload:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Product object
 *       404:
 *         description: No products available
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: No products available
 */
router.route("/").get(getAllProducts);

/**
 * @swagger
 * /api/v{version}/products/{productId}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     description: Fetches a single product by its ID.
 *     security: []
 *     parameters:
 *       - in: path
 *         name: version
 *         schema:
 *           type: string
 *         required: true
 *         description: The API version
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product
 *     responses:
 *       200:
 *         description: Successfully fetched product
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
 *                   example: Product fetched successfully
 *                 payload:
 *                   type: object
 *                   description: Product object
 *       400:
 *         description: Invalid product ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid product ID
 */
router.route("/:productId").get(getProduct);

export { router };
