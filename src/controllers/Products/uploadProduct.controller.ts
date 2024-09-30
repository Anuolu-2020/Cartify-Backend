import { NextFunction, Request, Response } from "express";
import {
	getDownloadURL,
	ref,
	updateMetadata,
	uploadBytesResumable,
} from "firebase/storage";
import xhr2 from "xhr2";
import bucketStorage from "../../config/firebase.config";
import productModel from "../../models/product.model";
import { IUser } from "../../models/user.interface";
import { validateProductUpload } from "../../utils/validateUserInput";

global.XMLHttpRequest = xhr2;

async function uploadFilesToFirebase(
	file: Express.Multer.File,
): Promise<string> {
	const timestamp = Date.now();
	const name = file.originalname.split(".")[0];
	const type = file.originalname.split(".")[1];
	const fileName = `${name}_${timestamp}.${type}`;

	// Step 1. Create reference for storage and file name in cloud
	const imageRef = ref(bucketStorage, `images/${fileName}`);

	try {
		// Step 2. Upload the file in the bucket storage
		const uploadImage = await uploadBytesResumable(imageRef, file.buffer);

		// Create file metadata.
		const newMetadata = {
			cacheControl: "public,max-age=2629800000",
			contentType: uploadImage.metadata.contentType,
		};

		// Update the metadata for the file.
		await updateMetadata(imageRef, newMetadata);

		//return image URL.
		return await getDownloadURL(imageRef);
	} catch (err) {
		throw new Error(`An Error occurred while uploading: ${err}`);
	}
}

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
