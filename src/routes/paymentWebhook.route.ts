import express from "express";
import { paymentWebhook } from "../controllers/payment.webhook";

const paymentRoute = express.Router();

paymentRoute.route("/transaction/webhook").post(paymentWebhook);

export { paymentRoute };
