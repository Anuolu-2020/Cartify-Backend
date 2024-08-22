import { NextFunction, Request, Response } from "express";
import { validateUserId } from "../../utils/validateUserInput";
import { errorHandler } from "../../utils/error.handler.class";
import { IUser } from "../../models/user.interface";
import { ApiFeatures } from "../../utils/ApiFeatures";
import { OrderModel } from "../../models/order.model";
import { ReqQuery } from "../../types/requestQuery.interface";
import { sendResponse } from "../../utils/response";

const getVendorOrders = async (
	req: Request<unknown, unknown, unknown, ReqQuery>,
	res: Response,
	next: NextFunction,
) => {
	const vendor = req.user as IUser;

	const vendorId = vendor._id;

	const { error } = validateUserId(vendorId);
	if (error) {
		const errorMessage = error.details[0].message.replace(/"/g, ""); // strip out quotes
		return next(new errorHandler(400, errorMessage));
	}

	const features = new ApiFeatures(
		OrderModel.find({
			paymentStatus: "completed",
		}),
		req.query,
	)
		.limitFields()
		.paginate();

	const orders = await features.modelQuery;

	if (!orders || orders.length === 0) {
		return next(new errorHandler(404, "You currently do not have any order"));
	}

	return sendResponse(res, 200, "Fetched orders successfully", orders);
};

export { getVendorOrders };
