import { NextFunction, Request, Response } from "express";
import cartModel from "../../models/cart.model";
import { IUser } from "../../models/user.interface";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getCart = async (req: Request, res: Response, _: NextFunction) => {
	const user = req.user as IUser;

	const userId = user._id;

	const cart = await cartModel.find({ user: userId });

	if (!cart || cart === null || cart.length === 0) {
		return res.status(404).json({
			success: true,
			message: "User doesn't have a cart yet",
		});
	}

	res.status(200).json({
		success: true,
		message: "Fetched user cart successfully",
		payload: { cart },
	});
};

export { getCart };
