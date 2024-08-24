import express from "express";

import { isRestrictedTo } from "../middlewares/roleAuth.middleware";

const userRoute = express.Router();

import {
	getUserData,
	createUser,
	deleteUsers,
	updateRole,
} from "../controllers/user.controller";
import { checkout } from "../controllers/checkout.controller";
import { createOrder } from "../controllers/Order/order.controller";

/**
 * @swagger
 * /api/v{version}/users/update-role:
 *   put:
 *     summary: Update user role
 *     tags: [Users]
 *     description: Updates the role of the authenticated user to "vendor".
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *                 example: "123 Main St"
 *               phoneNumber:
 *                 type: string
 *                 example: "+1234567890"
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       400:
 *         description: Invalid user data
 *       404:
 *         description: User not found
 */
userRoute.route("/update-role").put(updateRole);

/**
 * @swagger
 * /api/v{version}/users/checkout:
 *   get:
 *     summary: User checkout
 *     tags: [Users]
 *     description: Initiates checkout process for the authenticated user.
 *     responses:
 *       200:
 *         description: Checkout process started successfully
 *       404:
 *         description: User checkout failed
 */
userRoute.route("/checkout").get(checkout);

/**
 * @swagger
 * /api/v{version}/users/order:
 *   post:
 *     summary: Create a new order
 *     tags: [Users]
 *     description: Creates a new order for the authenticated user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderDetails:
 *                 type: string
 *                 example: "Order details here"
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid order data
 */
userRoute.route("/order").post(createOrder);

/**
 * @swagger
 * /api/v{version}/users:
 *   get:
 *     summary: Get user data
 *     tags: [Users]
 *     description: Retrieves all user data. Restricted to admin users.
 *     responses:
 *       200:
 *         description: Successfully fetched user data
 *       500:
 *         description: Error fetching user data
 */
userRoute.use(isRestrictedTo("admin"));

/**
 * @swagger
 * /api/v{version}/users:
 *   get:
 *     summary: Get user data
 *     tags: [Users]
 *     description: Retrieves all user data. Restricted to admin users.
 *     responses:
 *       200:
 *         description: Successfully fetched user data
 *       500:
 *         description: Error fetching user data
 */
userRoute.route("/").get(getUserData);

/**
 * @swagger
 * /api/v{version}/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     description: Creates a new user with the provided email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: No email or password provided
 *       500:
 *         description: Error creating user
 */
userRoute.route("/").post(createUser);

/**
 * @swagger
 * /api/v{version}/users:
 *   delete:
 *     summary: Delete all users
 *     tags: [Users]
 *     description: Deletes all users from the database. Restricted to admin users.
 *     responses:
 *       200:
 *         description: Successfully cleared the database
 *       500:
 *         description: Error deleting users
 */
userRoute.route("/").delete(deleteUsers);

export { userRoute };
