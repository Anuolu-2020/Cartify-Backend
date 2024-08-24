import express, { Router } from "express";

// Importing the controller functions
import {
	handleSignOut,
	handleGoogle,
} from "../../controllers/Auth/auth.controller";

export const authRoute: Router = express.Router();

/**
 * @swagger
 * /api/v{version}/auth/google:
 *   post:
 *     summary: Handle Google sign-in/sign-up
 *     tags: [Auth]
 *     description: Authenticate user using Google OAuth and sign them in or create a new account if they don't exist.
 *     security: []
 *     parameters:
 *       - in: path
 *         name: version
 *         schema:
 *           type: string
 *         required: true
 *         description: The API version
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Google OAuth token
 *     responses:
 *       200:
 *         description: Successfully signed in with Google
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
 *                   example: Successfully signed in with Google.
 *                 payload:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       description: The user object
 *       500:
 *         description: An error occurred during the Google sign-in process
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
 *                   example: An error occurred while signing user in
 */
// HANDLE GOOGLE SIGN-UP/SIGN-IN REQUESTS
authRoute.route("/google").post(handleGoogle);

/**
 * @swagger
 * /api/v{version}/auth/sign-out:
 *   post:
 *     summary: Handle user sign-out
 *     tags: [Auth]
 *     description: Signs the user out by clearing their session and cookies.
 *     security: []
 *     parameters:
 *       - in: path
 *         name: version
 *         schema:
 *           type: string
 *         required: true
 *         description: The API version
 *     responses:
 *       200:
 *         description: Successfully signed out
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
 *                   example: User Signed out successfully
 *       500:
 *         description: Internal server error
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
 *                   example: Internal server error, unable to sign user out.
 */
// HANDLE SIGN-OUT REQUEST
authRoute.route("/sign-out").post(handleSignOut);
