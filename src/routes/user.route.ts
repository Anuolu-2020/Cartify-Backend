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
import { paymentWebhook } from "../controllers/payment.webhook";

userRoute.route("/update-role").put(updateRole);
userRoute.route("/checkout").get(checkout);
userRoute.route("/order").post(createOrder);
userRoute.route("/order/transaction/webhook").post(paymentWebhook);

userRoute.use(isRestrictedTo("admin"));

userRoute.route("/").get(getUserData).post(createUser).delete(deleteUsers);

export { userRoute };
