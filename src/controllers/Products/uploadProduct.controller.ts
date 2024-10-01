import { NextFunction, Request, Response } from "express";
import xhr2 from "xhr2";
import productModel from "../../models/product.model";
import { IUser } from "../../models/user.interface";
import { uploadFilesToFirebase } from "../../utils/firebase";
import { validateProductUpload } from "../../utils/validateUserInput";

global.XMLHttpRequest = xhr2;

const uploadProduct = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
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

		//Upload images and wait for all image url
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

		const vendor = req.user as IUser;
		const vendorId = vendor._id;

		const newProduct = await new productModel({
			vendor: vendorId,
			name: productName,
			photo: uploadedImagesUrls,
			productDetails: productDetails,
			price: productPrice,
			category: category,
			units: units,
			discountPercentage,
		}).save();

		res.status(201).json({
			success: true,
			message: "Product uploaded successfully",
			payload: { newProduct },
		});
	} catch (err) {
		next(err);
	}
};

export { uploadProduct };
