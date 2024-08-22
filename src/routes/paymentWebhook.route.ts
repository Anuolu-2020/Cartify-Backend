import express from "express";
import { paymentWebhook } from "../controllers/payment.webhook";

const paymentRoute = express.Router();

paymentRoute.route("/transaction/paystack-webhook").post(paymentWebhook);

export { paymentRoute };
