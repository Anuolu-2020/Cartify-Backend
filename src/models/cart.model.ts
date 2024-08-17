import mongoose from "mongoose";
import { ICart } from "./cart.interface";

const Schema = mongoose.Schema;

const cartSchema = new Schema<ICart>(
	{
		user: {
			type: mongoose.Types.ObjectId,
			ref: "Users",
		},
		products: [
			{
				productId: { type: mongoose.Types.ObjectId, ref: "Products" },
				units: {
					type: Number,
					required: [true, "Product units must be provided"],
				},
				name: {
					type: String,
					required: [true, "A product name must be provided"],
				},
				photo: {
					type: String,
					required: [true, "Product must have a photo"],
				},

				price: {
					type: Number,
					required: [true, "Product price is required"],
					min: [0, "The minimum price shouldn't be below zero"],
				},
				discountPercentage: {
					type: Number,
					required: true,
					min: 0,
					max: 100,
				},
			},
		],
		totalPrice: {
			type: Number,
			min: [0, "The minimum price shouldn't be below zero"],
			required: true,
		},
		totalDiscountedPrice: {
			type: Number,
			min: 0,
			required: true,
		},
	},
	{ timestamps: true },
);

const cartModel = mongoose.model<ICart>("Cart", cartSchema);

export = cartModel;
