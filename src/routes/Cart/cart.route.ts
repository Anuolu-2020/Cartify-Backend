import express, { Router } from "express";
import addToCart from "../../controllers/Cart/addToCart.controller";
import { getCart } from "../../controllers/Cart/getCart.controller";
import removeFromCart from "../../controllers/Cart/removeFromCart.controller";

const router: Router = express.Router();

/**
 * @swagger
 * /api/v{version}/carts:
 *   post:
 *     summary: Add a product to the cart
 *     tags: [Cart]
 *     description: Adds a product to the user's cart. If the user already has a cart, the product is either added or updated in the cart. If not, a new cart is created.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "64f1d8bce712f1f5c5e5e5e5"
 *               quantity:
 *                 type: number
 *                 example: 2
 *     responses:
 *       201:
 *         description: Product added to cart successfully
 *       400:
 *         description: Invalid product data
 *       403:
 *         description: Product out of stock or insufficient stock
 *       404:
 *         description: Product not found
 */
router.route("/").post(addToCart);

/**
 * @swagger
 * /api/v{version}/carts:
 *   get:
 *     summary: Get the user's cart
 *     tags: [Cart]
 *     description: Fetches the current cart for the authenticated user.
 *     responses:
 *       200:
 *         description: Successfully fetched user cart
 *       404:
 *         description: User doesn't have a cart
 */
router.route("/").get(getCart);

/**
 * @swagger
 * /api/v{version}/carts/{productId}:
 *   delete:
 *     summary: Remove a product from the cart
 *     tags: [Cart]
 *     description: Removes a product from the user's cart.
 *     parameters:
 *       - in: path
 *         name: version
 *         required: true
 *         schema:
 *           type: string
 *         description: The API version
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to remove from the cart
 *     responses:
 *       200:
 *         description: Product successfully removed from cart
 *       400:
 *         description: Invalid product ID
 *       404:
 *         description: Product not found in the cart
 */
router.route("/:productId").delete(removeFromCart);

export { router };
