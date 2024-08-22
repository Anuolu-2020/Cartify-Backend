import mongoose from "mongoose";
import { ICheckout } from "./checkout.interface";

const Schema = mongoose.Schema;

const checkoutSchema = new Schema<ICheckout>({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Users",
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	products: [
		{
			vendor: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Users",
				required: true,
			},
			productId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Products",
				required: true,
			},
			name: {
				type: String,
				required: true,
			},
			quantity: {
				type: Number,
				required: true,
			},
			price: {
				type: Number,
				required: true,
			},
			discountedPrice: {
				type: Number,
				required: true,
			},
		},
	],
	totalPrice: {
		type: Number,
		required: true,
	},
	totalDiscountedPrice: {
		type: Number,
		required: true,
	},
	shippingAddress: {
		type: String,
		required: true,
	},
	deliveryFee: {
		type: Number,
		required: true,
	},
	grandTotal: {
		type: Number,
		required: true,
	},
});

export const CheckoutModel = mongoose.model<ICheckout>(
	"checkouts",
	checkoutSchema,
);
