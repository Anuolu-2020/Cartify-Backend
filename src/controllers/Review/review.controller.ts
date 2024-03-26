import { Request, Response, NextFunction } from "express";
import {
  validateProductId,
  validateUserId,
  validateProductReview,
} from "../../utils/validateUserInput";
import { errorHandler } from "../../utils/error.handler.class";
import reviewModel from "../../models/review.model";
import productModel from "../../models/product.model";
import { ApiFeatures } from "../../utils/ApiFeatures";
import { ReqQuery, productParams } from "../../types/requestQuery.interface";

export const addReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Get the userId and productId from the request params
    const { userId, productId } = req.params;

    // Validate the userId and productId
    const validation1 = validateProductId(productId);

    // Validate the userId
    const validation2 = validateUserId(userId);

    if (validation1.error) {
      const errorMessage = validation1.error.details[0].message.replace(
        /"/g,
        "",
      ); // strip out quotes
      return next(new errorHandler(400, errorMessage));
    }

    if (validation2.error) {
      const errorMessage = validation2.error.details[0].message.replace(
        /"/g,
        "",
      ); // strip out quotes
      return next(new errorHandler(400, errorMessage));
    }

    // Get the rating and review from the request body
    const { rating, review } = req.body;

    // Validate the rating and review
    const { error } = validateProductReview({ rating, review });

    if (error) {
      const errorMessage = error.details[0].message.replace(/"/g, ""); // strip out quotes
      return next(new errorHandler(400, errorMessage));
    }

    // Get the product from the database
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if the user has already reviewed the product
    const userReview = await reviewModel.findOne({ productId, user: userId });

    if (userReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    // Create a new review
    const newReview = await reviewModel.create({
      productId,
      userId,
      rating: rating,
      review: review,
    });

    // send the Response
    res.status(201).json({
      success: true,
      message: "Review added successfully",
      payload: newReview,
    });
  } catch (err) {
    return next(err);
  }
};

// Get all reviews for a product
export const getReviews = async (
  req: Request<productParams, unknown, unknown, ReqQuery>,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Get the productId from the request params
    const { productId } = req.params;

    // Validate the productId
    const validation = validateProductId(productId);

    if (validation.error) {
      const errorMessage = validation.error.details[0].message.replace(
        /"/g,
        "",
      ); // strip out quotes
      return next(new errorHandler(400, errorMessage));
    }

    // Get the query from the request
    const { query } = req;

    /// Get all reviews for the product with filtering, sorting, and pagination
    const features = new ApiFeatures(reviewModel.find({ productId }), query)
      .limitFields()
      .paginate();

    const reviews = await features.modelQuery;

    // Check if there are no reviews
    if (!reviews) {
      return res.status(404).json({
        success: false,
        message: "No reviews found",
      });
    }

    // Send the Response
    res.status(200).json({
      success: true,
      payload: reviews,
    });
  } catch (err) {
    return next(err);
  }
};
