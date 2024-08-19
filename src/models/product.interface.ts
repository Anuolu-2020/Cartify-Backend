import mongoose, { Document } from "mongoose";

export interface IProducts extends Document {
	vendor: {
		ref: string;
		type: mongoose.Types.ObjectId;
	};
	name: string;
	photo: string;
	productDetails: string;
	category: string;
	price: number;
	rating: number;
	vendorName: string;
	vendorAddress: string;
	units: number;
	discountPercentage: number;
	discountPrice?: number;
}
