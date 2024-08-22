import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import { runInTransaction } from "../utils/mongoose.transaction";
import { OrderModel } from "../models/order.model";
import { createId } from "@paralleldrive/cuid2";
import { CheckoutModel } from "../models/checkout.model";
import cartModel from "../models/cart.model";
import { userModel } from "../models/user.model";
import productModel from "../models/product.model";
import { EmailService } from "../email/email.service";

export const paymentWebhook = async (
	req: Request,
	res: Response,
	_: NextFunction,
) => {
	try {
		const secret = process.env.PAYSTACK_SECRET_KEY;

		const hash = crypto
			.createHmac("sha512", secret)
			.update(JSON.stringify(req.body))
			.digest("hex");

		if (hash != req.headers["x-paystack-signature"]) {
			return res.sendStatus(401);
		}

		res.sendStatus(200);

		// Retrieve the request's body
		const event = req.body;

		// Do something with event
		console.log(event);

		const userEmail = event["data"].customer["email"];

		//Find user
		const user = await userModel.findOne({ email: userEmail });

		const paymentReferenceCode = event["data"].reference;

		// Find the cart with product IDs and quantities
		const cart = await cartModel
			.findOne({ user: user._id })
			.populate("products.productId");

		if (!cart) {
			throw new Error("Cart not found");
		}

		//Create tracking number
		const orderTrackingId = createId();

		//If payment is successful
		if (event.event === "charge.success") {
			await runInTransaction(async (session) => {
				//Update order model
				const order = await OrderModel.findOneAndUpdate(
					{ email: userEmail, paymentReferenceCode },
					{ paymentStatus: "completed", orderTrackingId },
					{ session },
				);

				const emailService = new EmailService();

				// Send payment confirmation mail
				await emailService.sendSuccessfulOrderMail(userEmail, {
					orderId: order._id,
					username: user.username,
					trackingId: orderTrackingId,
					totalAmount: order.grandTotal,
					deliveryDate: order.deliveryDate,
				});

				// Delete checkout
				await CheckoutModel.findOneAndDelete({ email: userEmail }, { session });

				// Loop through the products in the cart
				const productUpdates = cart.products.map(async (cartProduct) => {
					const product = await productModel
						.findById(cartProduct.productId)
						.session(session);

					if (!product) {
						throw new Error(
							`Product with ID ${cartProduct.productId} not found`,
						);
					}

					// Decrement the unit by the quantity in the cart
					product.units -= cartProduct.quantity;

					// Ensure stock doesn't go below 0
					if (product.units < 0) {
						throw new Error(`Insufficient stock for product ${product.name}`);
					}

					// Save the updated product within the transaction
					await product.save({ session });

					// Delete cart
					await cartModel.findOneAndDelete({ user: user._id });
				});

				// Await all updates
				await Promise.all(productUpdates);
			});
			return;
		} else {
			//Order failed, Update order model
			await OrderModel.findOneAndUpdate(
				{ email: userEmail, paymentReferenceCode },
				{ paymentStatus: "failed", orderTrackingId },
			);
			return;
		}
	} catch (err) {
		console.error(err);
	}
};
