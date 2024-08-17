import mongoose from "mongoose";
import { IOrder } from "./order.interface";

const Schema = mongoose.Schema;

const orderSchema = new Schema<IOrder>({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Users",
		required: true,
	},
	products: [
		{
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
		},
	],
	totalPrice: {
		type: Number,
		required: true,
	},
	paymentMethod: {
		type: String,
		required: true,
	},
	paymentStatus: {
		type: String,
		enum: ["completed", "pending", "failed"],
		required: true,
	},
	shippingAddress: {
		type: String,
		required: true,
	},
	orderDate: {
		type: Date,
		default: Date.now,
		required: true,
	},
	deliveryDate: {
		type: Date,
	},
	orderStatus: {
		type: String,
		enum: ["pending", "shipped", "delivered", "canceled"],
		default: "pending",
	},
	trackingNumber: {
		type: String,
	},
	discount: {
		type: Number,
	},
});

export const OrderModel = mongoose.model<IOrder>("orders", orderSchema);