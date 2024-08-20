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

export interface IOrder extends Document {
	userId: ObjectId;
	email: string;
	products: Product[];
	totalPrice: number;
	paymentMethod: string;
	paymentStatus: "completed" | "pending" | "failed";
	shippingAddress: string;
	orderDate: Date;
	deliveryDate?: Date;
	orderStatus: "pending" | "shipped" | "delivered" | "canceled";
	trackingNumber?: string;
	totalDiscountedPrice: number;
	grandTotal: number;
}
