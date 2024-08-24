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

// Setting up multer as a middleware to grab photo uploads
const storage = multer.memoryStorage();

// Multer filter to check if the file is an image
const upload = multer({ storage: storage });

router.use(isRestrictedTo("vendor", "admin"));

/**
 * @swagger
 * /api/v{version}/vendor/product:
 *   post:
 *     summary: Upload a product
 *     tags: [Vendor]
 *     description: Allows a vendor to upload a new product.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               productImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product uploaded successfully
 *       400:
 *         description: Invalid product data
 */
router.route("/product").post(upload.single("productImage"), uploadProduct);

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
