import { NextFunction, Request, Response } from "express";
import { deleteObject, ref } from "firebase/storage";
import bucketStorage from "../../config/firebase.config";
import productModel from "../../models/product.model";
import { IUser } from "../../models/user.interface";
import { productParams } from "../../types/requestQuery.interface";
import { errorHandler } from "../../utils/error.handler.class";
import { validateIds } from "../../utils/validateUserInput";
import { IDeleteResult, Iproducts } from "./product.interface";

async function deleteImagesFromFirebase(fileUrl: string) {
	const fileRef = ref(bucketStorage, fileUrl);

	await deleteObject(fileRef)
		.then(() => {
			console.log("File deleted Successfully");
		})
		.catch((err) => {
			console.log(err);
			throw err;
		});
}

// Delete a vendor's products
const deleteVendorProducts = async (
	req: Request<productParams, unknown, unknown, unknown>,
	res: Response,
	next: NextFunction,
) => {
	// Validate the productIds
	const { error } = validateIds(req.params.productIds);

	// If the productIds are not valid, return an error message
	if (error) {
		const errorMessage = error.details[0].message.replace(/"/g, ""); // strip out quotes
		return res.status(400).json({ success: false, message: errorMessage });
	}

	try {
		const { productIds } = req.params;

		const user = req.user as IUser;

		const userId = user._id;

		const products = await productModel.find({
			_id: { $in: productIds },
			vendor: userId,
		});

		//Delete the product pictures
		products.forEach(async (product: Iproducts) => {
			await Promise.all(product.photo.map(deleteImagesFromFirebase));
		});

		const vendor = req.user as IUser;

		const vendorId = vendor._id;

		//Delete from products db
		await productModel
			.deleteMany({ _id: { $in: productIds }, vendor: vendorId })
			.then((result: IDeleteResult) => {
				if (result.deletedCount === 0) {
					return res.status(404).json({
						success: false,
						message:
							"No products belonging to the vendor were found to delete.",
					});
				} else {
					if (result.deletedCount === 1) {
						return res.status(200).json({
							success: true,
							message: `${result.deletedCount} product deleted successfully.`,
						});
					}
					return res.status(200).json({
						success: true,
						message: `${result.deletedCount} products deleted successfully.`,
					});
				}
			});
	} catch (err) {
		console.log(err);
		next(new errorHandler(500, "Failed to delete products"));
	}
};

export = deleteVendorProducts;
