import { NextFunction, Request, Response } from "express";
import {
	validateUserId,
	validateAcceptOrder,
} from "../../utils/validateUserInput";
import { errorHandler } from "../../utils/error.handler.class";
import { OrderModel } from "../../models/order.model";
import { sendResponse } from "../../utils/response";

const acceptOrder = async (req: Request, res: Response, next: NextFunction) => {
	const { orderId } = req.params;

	const { orderStatus } = req.body;

	//Can also validate orderId
	const error1 = validateUserId(orderId);
	if (error1.error) {
		const errorMessage = error1.error.details[0].message.replace(/"/g, ""); // strip out quotes
		return next(new errorHandler(400, errorMessage));
	}

	const error2 = validateAcceptOrder(orderStatus);
	if (error2.error) {
		const errorMessage = error2.error.details[0].message.replace(/"/g, ""); // strip out quotes
		return next(new errorHandler(400, errorMessage));
	}

	const acceptedOrder = await OrderModel.findByIdAndUpdate(
		{ _id: orderId },
		{ orderStatus },
		{ new: true, runValidators: true },
	);

	if (!acceptOrder) {
		return next(new errorHandler(404, "Order not found"));
	}

	return sendResponse(
		res,
		200,
		"Order status updated successfully",
		acceptedOrder.toObject(),
	);
};

export { acceptOrder };
