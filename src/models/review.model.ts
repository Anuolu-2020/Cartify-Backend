import mongoose, { Query } from "mongoose";
import { IReview } from "./review.interface";
import { NextFunction } from "express";

const Schema = mongoose.Schema;

const reviewSchema = new Schema<IReview>({
	product: {
		type: mongoose.Types.ObjectId,
		ref: "Products",
		required: [true, "Product id must be provided"],
	},
	user: {
		type: mongoose.Types.ObjectId,
		ref: "Users",
		required: [true, "User id must be provided"],
	},
	rating: {
		type: Number,
		required: [true, "Rating must be provided"],
		min: 0,
		max: 5,
	},
	review: {
		type: String,
		required: [true, "Review must be provided"],
	},
	timestamp: { type: Date, default: Date.now },
});

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

reviewSchema.pre<Query<IReview, IReview>>(
	/^find/,
	function (next: NextFunction) {
		this.populate({
			path: "user",
			select: "name email",
		});

		next();
	},
);

const reviewModel = mongoose.model<IReview>("Reviews", reviewSchema);

export = reviewModel;
