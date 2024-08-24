import express from "express";
import { paymentWebhook } from "../controllers/payment.webhook";

const paymentRoute = express.Router();

/**
 * @swagger
 * /api/v{version}/payment/transaction/paystack-webhook:
 *   post:
 *     summary: Paystack Webhook for Payment Status
 *     tags: [Payment]
 *     security: []
 *     description: Receives payment notifications from Paystack and processes order and inventory updates.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   customer:
 *                     type: object
 *                     properties:
 *                       email:
 *                         type: string
 *                         example: "user@example.com"
 *                   reference:
 *                     type: string
 *                     example: "paystack_reference_code"
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *       401:
 *         description: Unauthorized request
 *       500:
 *         description: Internal server error
 */
paymentRoute.route("/transaction/paystack-webhook").post(paymentWebhook);

export { paymentRoute };
