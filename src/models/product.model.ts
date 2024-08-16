import mongoose from "mongoose";
import { IProducts } from "./product.interface";
import reviewModel from "./review.model";

const Schema = mongoose.Schema;

const productSchema = new Schema<IProducts>({
	vendor: {
		type: mongoose.Types.ObjectId,
		ref: "Users",
		required: [true, "Vendor id not provided"],
	},
	name: {
		type: String,
		required: [true, "A product name must be provided"],
	},
	photo: {
		type: String,
		required: [true, "Product photo url must be provided"],
	},
	productDetails: {
		type: String,
		required: [true, "Product details muust be provided"],
	},
	category: {
		type: String,
		required: [true, "A category must be provided for the product"],
	},
	price: {
		type: Number,
		default: 0,
		required: [true, "A price must be provided for the product"],
		min: 0,
	},
	units: {
		type: Number,
		required: [true, "A stock amount must be provided for the product"],
		min: 0,
	},
});

productSchema.virtual("averageRating").get(async function (this: IProducts) {
	const productId = this._id;

	const averageRating = await reviewModel.aggregate([
		{ $match: { productId } },
		{ $group: { _id: "$productId", averageRating: { $avg: "$rating" } } },
	]);

	return averageRating.length > 0 ? averageRating[0]?.averageRating : 0;
});

const productModel = mongoose.model<IProducts>("Products", productSchema);

export = productModel;
