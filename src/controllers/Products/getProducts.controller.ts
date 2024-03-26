import productModel from "../../models/product.model";
import { IUser } from "../../models/user.interface";
import { ReqQuery, productParams } from "../../types/requestQuery.interface";
import { ApiFeatures } from "../../utils/ApiFeatures";
import { errorHandler } from "../../utils/error.handler.class";
import {
  validateProductId,
  validateUserId,
} from "../../utils/validateUserInput";
import { Response, NextFunction, Request } from "express";

// Get all products
const getAllProducts = async (
  req: Request<unknown, unknown, unknown, ReqQuery>,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Advanced filtering
    const features = new ApiFeatures(
      productModel.find(),
      req.query,
    ).limitFields();

    // Get the products after filtering
    const product = await features.modelQuery;

    if (!product || product.length === 0) {
      return res.status(404).json({
        success: true,
        message: "No products available",
      });
    }

    res.status(200).json({
      success: true,
      results: product.length,
      message: "Products fetched successfully",
      payload: product,
    });
  } catch (err) {
    next(err);
  }
};

// Get a single product
const getProduct = async (
  req: Request<productParams, unknown, unknown, ReqQuery>,
  res: Response,
  next: NextFunction,
) => {
  const { productId } = req.params;

  const { error } = validateProductId(productId);

  if (error) {
    const errorMessage = error.details[0].message.replace(/"/g, ""); // strip out quotes
    return next(new errorHandler(400, errorMessage));
  }

  try {
    // Advanced filtering
    const features = new ApiFeatures(
      productModel.find({ _id: productId }),
      req.query,
    ).limitFields();

    // Get the product after filtering
    const product = await features.modelQuery;

    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      payload: product,
    });
  } catch (err) {
    next(err);
  }
};

// Get all products uploaded by a vendor
const getVendorProducts = async (
  req: Request<unknown, unknown, unknown, ReqQuery>,
  res: Response,
  next: NextFunction,
) => {
  const vendor = req.user as IUser;

  const vendorId = vendor._id;

  const { error } = validateUserId(vendorId);

  if (error) {
    const errorMessage = error.details[0].message.replace(/"/g, ""); // strip out quotes
    return next(new errorHandler(400, errorMessage));
  }

  try {
    const features = new ApiFeatures(
      productModel.find({ vendorId: vendorId }),
      req.query,
    ).limitFields();

    const product = await features.modelQuery;

    if (!product || product.length === 0) {
      return res.status(200).json({
        success: true,
        message: "You have no products uploaded yet",
      });
    }

    res.status(200).json({
      success: true,
      results: product.length,
      message: "Your Products fetched successfully",
      payload: product,
    });
  } catch (err) {
    next(err);
  }
};

export { getAllProducts, getVendorProducts, getProduct };
