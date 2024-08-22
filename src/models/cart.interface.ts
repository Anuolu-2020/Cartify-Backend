import mongoose, { Document } from "mongoose";

export interface ICart extends Document {
	user: { type: mongoose.Types.ObjectId };
	products: [
		{
			vendor: { type: mongoose.Types.ObjectId };
			productId: { type: mongoose.Types.ObjectId };
			quantity: number;
			name: string;
			photo: string;
			price: number;
			discountPercentage: number;
			discountedPrice: number;
		},
	];
	totalPrice: number;
	totalDiscountedPrice: number;
}

export interface Item {
	productId: { type: mongoose.Types.ObjectId };
	quantity: number;
	name: string;
	price: number;
}
