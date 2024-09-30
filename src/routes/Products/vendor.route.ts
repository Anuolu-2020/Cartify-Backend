import express, { Router } from "express";

import multer from "multer";

const router: Router = express.Router();

// Importing the controller functions
import { uploadProduct } from "../../controllers/Products/uploadProduct.controller";
import { getVendorProducts } from "../../controllers/Products/getProducts.controller";
import deleteVendorProducts from "../../controllers/Products/deleteProducts";
import { isRestrictedTo } from "../../middlewares/roleAuth.middleware";
import { getVendorOrders } from "../../controllers/vendor/getOrders.controller";
import { acceptOrder } from "../../controllers/vendor/acceptOrder.controller";
import { handleMulterError } from "../../utils/multerErrorHandler";

// Setting up multer as a middleware to grab photo uploads
const storage = multer.memoryStorage();

// Multer filter to check if the file is an image
const upload = multer({
	storage: storage,
	limits: { fileSize: 1 * 1024 * 1024 },
});

router.use(isRestrictedTo("vendor", "admin"));

/**
 * @swagger
 * /api/v{version}/vendor/product:
 *   post:
 *     summary: Upload a product with multiple images
 *     tags: [Vendor]
 *     description: Allows a vendor to upload a new product with up to 3 images.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - productName
 *               - productDetails
 *               - productPrice
 *               - category
 *               - units
 *             properties:
 *               productName:
 *                 type: string
 *                 description: Name of the product
 *               productDetails:
 *                 type: string
 *                 description: Detailed description of the product
 *               productPrice:
 *                 type: number
 *                 description: Price of the product
 *               category:
 *                 type: string
 *                 enum:
 *                   - "Electronics & Gadgets"
 *                   - "Fashion & Apparel"
 *                   - "Health & Beauty"
 *                   - "Home & Kitchen"
 *                   - "Sports & Outdoors"
 *                   - "Toys & Games"
 *                   - "Books & Stationery"
 *                 description: Category of the product
 *               units:
 *                 type: integer
 *                 description: Number of units available
 *               productImage:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 maxItems: 3
 *                 description: Up to 3 images of the product (max 1MB each)
 *               discountPercentage:
 *                 type: number
 *                 description: Discount percentage for the product (optional)
 *     responses:
 *       201:
 *         description: Product uploaded successfully
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
 *                   example: Product uploaded successfully
 *                 payload:
 *                   type: object
 *                   properties:
 *                     newProduct:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 60d5ecb74f52e
 *                         name:
 *                           type: string
 *                           example: Smartphone X
 *                         photo:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example:
 *                             - "https://firebasestorage.url/image1.jpg"
 *                             - "https://firebasestorage.url/image2.jpg"
 *                         # Add other product properties here
 *       400:
 *         description: Invalid product data or file upload error
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
 *                   example: File is too large. Max size is 1MB.
 *       401:
 *         description: Unauthorized - User is not a vendor or admin
 *       500:
 *         description: Server error
 */
router
	.route("/product")
	.post(upload.array("productImage", 3), handleMulterError, uploadProduct);

/**
 * @swagger
 * /api/v{version}/vendor/products:
 *   get:
 *     summary: Get all vendor products
 *     tags: [Vendor]
 *     description: Fetch all products uploaded by the vendor.
 *     responses:
 *       200:
 *         description: Successfully fetched vendor products
 *       404:
 *         description: No products found
 *   delete:
 *     summary: Delete all vendor products
 *     tags: [Vendor]
 *     description: Deletes all products uploaded by the vendor.
 *     responses:
 *       204:
 *         description: Successfully deleted vendor products
 *       404:
 *         description: No products found to delete
 */
router.route("/products").get(getVendorProducts).delete(deleteVendorProducts);

/**
 * @swagger
 * /api/v{version}/vendor/products/orders:
 *   get:
 *     summary: Get vendor orders
 *     tags: [Vendor]
 *     description: Fetch all orders placed on the vendor's products.
 *     responses:
 *       200:
 *         description: Successfully fetched vendor orders
 *       404:
 *         description: No orders found
 */
router.route("/products/orders").get(getVendorOrders);

/**
 * @swagger
 * /api/v{version}/vendor/products/orders/{orderId}:
 *   post:
 *     summary: Accept an order
 *     tags: [Vendor]
 *     description: Allows the vendor to accept an order.
 *     parameters:
 *       - in: path
 *         name: version
 *         required: true
 *         schema:
 *           type: string
 *         description: The API version
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderStatus:
 *                 type: string
 *                 example: accepted
 *     responses:
 *       200:
 *         description: Successfully accepted the order
 *       400:
 *         description: Invalid order ID or status
 *       404:
 *         description: Order not found
 */
router.route("/products/orders/:orderId").post(acceptOrder);

export { router };
