import { Response, Request, NextFunction } from "express";
import { IUser } from "../../models/user.interface";
import { validateOrder, validateUserId } from "../../utils/validateUserInput";
import { errorHandler } from "../../utils/error.handler.class";
import { CheckoutModel } from "../../models/checkout.model";
import { OrderModel } from "../../models/order.model";
import { PaymentService } from "../../Payment/payment.service";
import { PAYMENT_METHOD, PaystackGateway } from "../../Payment/payment.gateway";
//import { createId } from "@paralleldrive/cuid2";

export const createOrder = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { paymentMethod } = req.body;

	const user = req.user as IUser;

	const userId = user._id;

	const validation1 = validateUserId(userId);
	if (validation1.error) {
		const errorMessage = validation1.error.details[0].message.replace(/"/g, "");
		return next(new errorHandler(400, errorMessage));
	}

	const validation2 = validateOrder(paymentMethod);
	if (validation2.error) {
		const errorMessage = validation2.error.details[0].message.replace(/"/g, "");
		return next(new errorHandler(400, errorMessage));
	}

	const checkout = await CheckoutModel.findOne({ userId });

	if (!checkout) {
		return next(new errorHandler(404, "No checkout found for user."));
	}

	const currentDate = new Date(); // Current date and time
	const orderDate = new Date(currentDate.getTime());

	// Deliver in two days. Hardcoded for now.
	const deliveryDate = new Date(
		currentDate.getTime() + 2 * 24 * 60 * 60 * 1000,
	); // Add 2 days in milliseconds

	const newOrder = await OrderModel.create({
		userId: checkout.userId,
		email: checkout.email,
		products: checkout.products,
		totalPrice: checkout.totalPrice,
		totalDiscountedPrice: checkout.totalDiscountedPrice,
		paymentMethod,
		paymentStatus: "pending",
		shippingAddress: checkout.shippingAddress,
		orderDate,
		deliveryDate,
		grandTotal: checkout.grandTotal,
	});

	const paymentService = new PaymentService();

	paymentService.registerGateway(
		PAYMENT_METHOD.PAYSTACK,
		new PaystackGateway(),
	);

	await paymentService.processPayment(newOrder, PAYMENT_METHOD.PAYSTACK);
};
