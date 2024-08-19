import mongoose from "mongoose";
import { IProducts } from "./product.interface";
import reviewModel from "./review.model";

const Schema = mongoose.Schema;

const productSchema = new Schema<IProducts>(
	{
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
			enum: [
				"Electronics & Gadgets",
				"Fashion & Apparel",
				"Health & Beauty",
				"Home & Kitchen",
				"Sports & Outdoors",
				"Toys & Games",
				"Books & Stationery",
			],
			required: true,
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
		discountPercentage: {
			type: Number,
			default: 0,
			required: [true, "A discount percentage must be provided"],
			min: 0,
			max: 90,
		},
	},
	{ timestamps: true },
);

productSchema.virtual("averageRating").get(async function (this: IProducts) {
	try {
		const productId = this._id;
		const result = await reviewModel.aggregate([
			{ $match: { product: productId } },
			{ $group: { _id: "$product", averageRating: { $avg: "$rating" } } },
		]);

		return result.length > 0 ? Number(result[0].averageRating.toFixed(2)) : 0;
	} catch (error) {
		console.error("Error calculating average rating:", error);
		return 0;
	}
});

// Virtual property to calculate the discounted price
productSchema.virtual("discountedPrice").get(function () {
	return this.price * (this.discountPercentage / 100);
});

// Set the virtuals to be included in JSON and Object outputs
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

const productModel = mongoose.model<IProducts>("Products", productSchema);

export = productModel;
