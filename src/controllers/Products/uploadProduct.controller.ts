import bucketStorage from "../../config/firebase.config";
import productModel from "../../models/product.model";
import { validateProductUpload } from "../../utils/validateUserInput";
import {
  ref,
  getDownloadURL,
  updateMetadata,
  uploadBytes,
} from "firebase/storage";
import { Request, Response, NextFunction } from "express";

// Workaround for the bug in xhr2 with firebase
import xhr2 from "xhr2"; // must be used to avoid bug

import { IUser } from "../../models/user.interface";

global.XMLHttpRequest = xhr2;

// Upload a product
const uploadProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Validate the product upload
    const { error } = validateProductUpload(req.body);

    if (error) {
      const errorMessage = error.details[0].message.replace(/"/g, ""); // strip out quotes
      return res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }

    //Grab file
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No image provided",
      });
    }

    // Format the filename
    const timestamp = Date.now();
    const name = file.originalname.split(".")[0];
    const type = file.originalname.split(".")[1];
    const fileName = `${name}_${timestamp}.${type}`;

    // Step 1. Create reference for storage and file name in cloud storage
    const imageRef = ref(bucketStorage, `images/${fileName}`);

    // Step 2. Upload the file in the bucket storage
    const uploadImage = await uploadBytes(imageRef, file.buffer);

    // Create file metadata.
    const newMetadata = {
      cacheControl: "public,max-age=2629800000", // 1 month
      contentType: uploadImage.metadata.contentType,
    };

    // Update the metadata for the file.
    await updateMetadata(imageRef, newMetadata);

    // Get the image URL.
    const downloadURL = await getDownloadURL(imageRef);

    const {
      productName,
      productDetails,
      productPrice,
      vendorName,
      vendorAddress,
    } = req.body;

    const vendor = req.user as IUser;

    const vendorId = vendor._id;

    // Save the product to the database
    const newProduct = await new productModel({
      vendorId: vendorId,
      name: productName,
      photo: downloadURL,
      productDetails: productDetails,
      price: productPrice,
      vendorName: vendorName,
      vendorAddress: vendorAddress,
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
