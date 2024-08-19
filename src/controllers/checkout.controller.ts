import { NextFunction, Request, Response } from "express";
import { IUser } from "../models/user.interface";
import { validateUserId } from "../utils/validateUserInput";
import { errorHandler } from "../utils/error.handler.class";
import cartModel from "../models/cart.model";
import { userModel } from "../models/user.model";
import { CheckoutModel } from "../models/checkout.model";
import { sendResponse } from "../utils/response";

export const checkout = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const user = req.user as IUser;

	const userId = user._id;

	const { error } = validateUserId(userId);
	if (error) {
		const errorMessage = error.details[0].message.replace(/"/g, "");
		return new errorHandler(400, errorMessage);
	}

	const userFound = await userModel.findById(userId);

	if (!userFound) {
		return next(new errorHandler(404, "User not found"));
	}

	const cart = await cartModel.findOne({ user: userId });

	if (!cart) {
		return next(new errorHandler(404, "User doesn't have a cart"));
	}

	const checkoutFound = await CheckoutModel.findOne({ userId });

	//Hard coded for now
	const deliveryFee = 600;

	const grandTotal = cart.totalPrice - cart.totalDiscountedPrice + deliveryFee;

	//If theres already a checkout
	if (checkoutFound) {
		// update checkout
		const updatedCheckout = await CheckoutModel.updateOne(
			userId,
			{
				products: cart.products,
				totalPrice: cart.totalPrice,
				shippingAddress: userFound.address,
				totalDiscountedPrice: cart.totalDiscountedPrice,
			},
			{ runValidators: true },
		);

		const data = {
			...updatedCheckout,
			grandTotal,
		};

		return sendResponse(res, 200, "Checkout data fetched successfully", data);
	}

	const checkout = await CheckoutModel.create({
		userId,
		products: cart.products,
		totalPrice: cart.totalPrice,
		shippingAdress: userFound.address,
		deliveryFee,
		totalDiscountedPrice: cart.totalDiscountedPrice,
	});

	const data = {
		...checkout,
		grandTotal,
	};

	return sendResponse(res, 200, "Checkout data fetched successfully", data);
};
