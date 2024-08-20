import { Document, ObjectId } from "mongoose";

interface Product {
	vendor: ObjectId;
	productId: ObjectId;
	name: string;
	photo: string;
	category: string;
	price: number;
	units: number;
}

export interface ICheckout extends Document {
	userId: ObjectId;
	email: string;
	products: Product[];
	totalPrice: number;
	totalDiscountedPrice: number;
	shippingAddress: string;
	deliveryFee: number;
	grandTotal: number;
}
