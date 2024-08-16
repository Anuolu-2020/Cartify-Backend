import { Request, Response, NextFunction } from "express";
import { productParams } from "../../types/requestQuery.interface";
import CartModel from "../../models/cart.model";
import { errorHandler } from "../../utils/error.handler.class";
import { validateProductId } from "../../utils/validateUserInput";
import { IUser } from "../../models/user.interface";
import { ICart, Item } from "../../models/cart.interface";

// Remove product from cart
const removeFromCart = async (
	req: Request<productParams, unknown, unknown, unknown>,
	res: Response,
	next: NextFunction,
) => {
	// Get productId from request params
	const { productId } = req.params;

	const { error } = validateProductId(productId);

	if (error) {
		const errorMessage = error.details[0].message.replace(/"/g, ""); // strip out quotes
		return next(new errorHandler(400, errorMessage));
	}

	try {
		const user = req.user as IUser;

		const userId = user._id;

		let cart: ICart = await CartModel.findOne({ user: userId });

		if (!cart) {
			return next(new errorHandler(404, "User doesn't have a cart"));
		}

		//Get index of the product in the products array
		const itemIndex = cart.products.findIndex((p) => p.productId == productId);

		//If product Exist
		if (itemIndex > -1) {
			//Delete product from cart
			cart.products.splice(itemIndex, 1);

			//Get total price of all products
			cart.totalPrice = cart.products
				.map((item: Item) => item.price)
				.reduce((acc: number, next: number) => acc + next);
		} else {
			return next(new errorHandler(404, "Product doesn't exist in the cart"));
		}

		//Save cart
		cart = await cart.save();

		res.status(200).json({
			success: true,
			message: "Product Successfully Removed",
			payload: { cart },
		});
	} catch (err) {
		return next(err);
	}
};

export = removeFromCart;
