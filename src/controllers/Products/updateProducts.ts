import { NextFunction, Request, Response } from "express";
import xhr2 from "xhr2";
import productModel from "../../models/product.model";
import { IUser } from "../../models/user.interface";
import { errorHandler } from "../../utils/error.handler.class";
import {
	deleteImagesFromFirebase,
	uploadFilesToFirebase,
} from "../../utils/firebase";
import {
	validateProductId,
	validateProductUpload,
} from "../../utils/validateUserInput";

global.XMLHttpRequest = xhr2;

const updateProduct = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const productId = req.params["productId"];
		const vendor = req.user as IUser;
		const vendorId = vendor._id;

		const productIdError = validateProductId(productId);
		if (productIdError.error) {
			const errorMessage = productIdError.error.details[0].message.replace(
				/"/g,
				"",
			);
			return next(new errorHandler(400, errorMessage));
		}

		const { error } = validateProductUpload(req.body);
		if (error) {
			const errorMessage = error.details[0].message.replace(/"/g, "");
			return res.status(400).json({
				success: false,
				message: errorMessage,
			});
		}

		const files = req.files as Express.Multer.File[];
		if (!files || files.length === 0) {
			return res.status(400).json({
				success: false,
				message: "No image provided",
			});
		}

		const product = await productModel.findOne({
			_id: productId,
			vendor: vendorId,
		});
		if (!product) {
			return next(new errorHandler(404, "Product not found"));
		}

		// Delete all existing images
		await Promise.all(product.photo.map(deleteImagesFromFirebase));

		// Upload new images and wait for all image URLs
		const uploadedImagesUrls = await Promise.all(
			files.map(uploadFilesToFirebase),
		);

		const {
			productName,
			productDetails,
			productPrice,
			category,
			units,
			discountPercentage,
		} = req.body;

		const updatedProduct = await productModel.findByIdAndUpdate(
			productId,
			{
				vendor: vendorId,
				name: productName,
				photo: uploadedImagesUrls,
				productDetails: productDetails,
				price: productPrice,
				category: category,
				units: units,
				discountPercentage,
			},
			{ new: true, runValidators: true },
		);

		if (!updatedProduct) {
			throw next(new errorHandler(500, "Failed to update product"));
		}

		res.status(200).json({
			success: true,
			message: "Product updated successfully",
			payload: { updatedProduct },
		});
	} catch (err) {
		next(err);
	}
};

export { updateProduct };
