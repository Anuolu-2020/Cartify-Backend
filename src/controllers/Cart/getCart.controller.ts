import { NextFunction, Request, Response } from "express";
import cartModel from "../../models/cart.model";
import { IUser } from "../../models/user.interface";
import { errorHandler } from "../../utils/error.handler.class";
import { sendResponse } from "../../utils/response";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getCart = async (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as IUser;

	const userId = user._id;

	const cart = await cartModel.find({ user: userId });

	if (!cart || cart === null || cart.length === 0) {
		return next(new errorHandler(404, "User doesn't have a cart yet"));
	}

	return sendResponse(res, 200, "Fetched user cart successfully", cart);
};

export { getCart };
